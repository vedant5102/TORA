# capture.py
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module='google.protobuf')



import cv2
import mediapipe as mp
import pandas as pd
import numpy as np
import os

OUT = "gesture_samples.csv"

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6
)
mp_draw = mp.solutions.drawing_utils

# Create dataset file
columns = []
for i in range(21):
    columns += [f"x{i}", f"y{i}", f"z{i}"]
columns.append("label")

if not os.path.exists(OUT):
    pd.DataFrame(columns=columns).to_csv(OUT, index=False)

label_map = {
    "1": "zoom_in",
    "2": "zoom_out",
    "3": "swipe_left",
    "4": "swipe_right",
    "5": "no_gesture"
}

print("Press 1,2,3,4,5 to record gestures | Press q to quit")

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb)

    features = [0]*63

    if result.multi_hand_landmarks:
        lm = result.multi_hand_landmarks[0]
        mp_draw.draw_landmarks(frame, lm, mp_hands.HAND_CONNECTIONS)

        features = []
        for point in lm.landmark:
            features += [point.x, point.y, point.z]

    cv2.putText(frame, "Press 1/2/3/4 to save | q quit", 
                (10,30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,0), 2)

    cv2.imshow("Capture Gestures", frame)
    key = cv2.waitKey(1) & 0xFF

    if key == ord("q"):
        break

    if chr(key) in label_map:
        df = pd.read_csv(OUT)
        df.loc[len(df)] = features + [label_map[chr(key)]]
        df.to_csv(OUT, index=False)
        print("Saved:", label_map[chr(key)])

cap.release()
cv2.destroyAllWindows()
