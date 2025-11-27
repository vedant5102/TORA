# train_model.py
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module='google.protobuf')


import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

CSV = "gesture_samples.csv"
MODEL = "model.pkl"

df = pd.read_csv(CSV)

X = df.drop(columns=["label"]).values
y = df["label"].values

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

clf = RandomForestClassifier(n_estimators=120)
clf.fit(X_train, y_train)

pred = clf.predict(X_test)
print(classification_report(y_test, pred))

joblib.dump(clf, MODEL)
print("✓ Model saved as model.pkl")
