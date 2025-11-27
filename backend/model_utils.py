# backend/model_utils.py
import joblib
import numpy as np
import os

MODEL_PATH = "model.pkl"

def load_model(path=MODEL_PATH):
    if os.path.exists(path):
        try:
            return joblib.load(path)
        except Exception as e:
            print("Model load failed:", e)
    return None

def landmarks_to_vector(landmarks):
    """
    landmarks: list of 21 objects/dicts with x,y,z
    returns: numpy array shape (63,)
    """
    if not landmarks:
        return np.zeros(63, dtype=float)
    vec = []
    for lm in landmarks:
        # lm could be dict or object with x,y,z attributes
        if isinstance(lm, dict):
            vec += [float(lm.get('x', 0.0)), float(lm.get('y', 0.0)), float(lm.get('z', 0.0))]
        else:
            # object (like mediapipe) with .x .y .z
            vec += [float(getattr(lm, 'x', 0.0)), float(getattr(lm, 'y', 0.0)), float(getattr(lm, 'z', 0.0))]
    return np.array(vec, dtype=float)
