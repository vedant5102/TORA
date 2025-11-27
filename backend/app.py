# backend/app.py
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module='google.protobuf')

from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO
from model_utils import load_model, landmarks_to_vector

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet",
                    ping_interval=25, ping_timeout=60)

model = load_model()

client_state = {}
DX_THRESH = 0.035
DY_THRESH = 0.035
STABLE_REQUIRED = 2


def detect_special_gestures(lm):
    """Detect FIST (lock) and THUMBS_UP (unlock)"""

    # Finger fold detection (tipY > mcpY = folded)
    index_down  = lm[8]["y"] > lm[5]["y"]
    middle_down = lm[12]["y"] > lm[9]["y"]
    ring_down   = lm[16]["y"] > lm[13]["y"]
    pinky_down  = lm[20]["y"] > lm[17]["y"]

    all_folded = index_down and middle_down and ring_down and pinky_down

    # Thumb-up detection (tip above IP joint + away from wrist)
    thumb_up = lm[4]["y"] < lm[3]["y"] and abs(lm[4]["x"] - lm[0]["x"]) > 0.02

    # ✊ Fist (lock)
    if all_folded and not thumb_up:
        return "fist"

    # 👍 Thumbs-up (unlock)
    if all_folded and thumb_up:
        return "thumbs_up"

    return None


def classify_gesture(lm, ml_pred):
    """Fallback gestures: swipe + zoom"""
    wrist = lm[0]
    index = lm[8]

    dx = index["x"] - wrist["x"]
    dy = index["y"] - wrist["y"]

    if ml_pred:
        return ml_pred

    if dx > DX_THRESH:
        return "swipe_right"

    if dx < -DX_THRESH:
        return "swipe_left"

    if dy < -DY_THRESH:
        return "zoom_in"

    if dy > DY_THRESH:
        return "zoom_out"

    return "no_gesture"


@socketio.on("connect")
def on_connect():
    sid = request.sid
    client_state[sid] = {"last_gesture": "no_gesture", "stable": 0}
    print("Client connected:", sid)


@socketio.on("disconnect")
def on_disconnect():
    sid = request.sid
    client_state.pop(sid, None)
    print("Client disconnected:", sid)


@socketio.on("landmarks")
def on_landmarks(data):
    sid = request.sid
    if sid not in client_state:
        client_state[sid] = {"last_gesture": "no_gesture", "stable": 0}

    state = client_state[sid]
    lm = data.get("landmarks")
    if not lm:
        return

    # ML prediction
    vec = landmarks_to_vector(lm).reshape(1, -1) if model else None
    try:
        ml_pred = model.predict(vec)[0] if model else None
    except:
        ml_pred = None

    # 1️⃣ Check special gestures first (immediate)
    special = detect_special_gestures(lm)
    if special:
        socketio.emit("gesture", {"gesture": special}, to=sid)
        state["last_gesture"] = special
        state["stable"] = 0
        return

    # 2️⃣ Swipe / Zoom logic
    proposed = classify_gesture(lm, ml_pred)

    # stability smoothing
    if proposed == state["last_gesture"]:
        state["stable"] += 1
    else:
        state["stable"] = 1
        state["last_gesture"] = proposed

    if state["stable"] >= STABLE_REQUIRED:
        socketio.emit("gesture", {"gesture": proposed}, to=sid)
        state["stable"] = 0


if __name__ == "__main__":
    print("Starting backend...")
    socketio.run(app, host="0.0.0.0", port=5000)
