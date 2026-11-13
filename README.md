# 🏥 TORA – Touchless Operating Room Assistant  
### AI-Powered Gesture-Driven surgical Assistant for Sterile Surgical Environments

TORA (Touchless Operating Room Assistant) is an AI-powered, gesture-controlled system designed to help surgeons interact with medical images and digital content without any physical contact.  
It improves sterility, workflow efficiency, and safety inside operating rooms using computer vision and machine learning.

---

## 🚀 Features

### 👋 Real-Time Gesture Recognition  
Supports six core gestures:
- Zoom In  
- Zoom Out  
- Swipe Left  
- Swipe Right  
- Fist (Freeze Image)  
- Thumbs Up (Unfreeze)

### 🖼️ Intelligent Image Viewer  
- Zoom, pan & swipe using gestures  
- Multi-image gallery  
- PDF and Image rendering  
- Gesture overlays

### 🧠 AI + Rule-Based Hybrid Engine  
- Mediapipe for hand landmark extraction  
- 63-keypoint vectorization  
- Random Forest ML classifier  
- Stability filtering to prevent accidental gestures

### ⚡ Low Latency  
- < 100 ms processing time  
- Smooth interaction with Socket.IO real-time streaming

---

## 🛠️ Tech Stack

**Frontend:**  
- React (Vite)  
- TailwindCSS  
- react-pdf  
- Mediapipe (camera processing)

**Backend:**  
- Flask  
- Flask-SocketIO  
- Eventlet  
- CORS  
- Python 3.10+

**Machine Learning:**  
- Mediapipe  
- Scikit-Learn (Random Forest)  
- Pandas / NumPy  
- Custom dataset (1,400+ samples)

---

## 📁 Project Structure
TORA/
│── backend/
│ ├── app.py
│ ├── train.py
│ ├── rf_infer.py
│ ├── capture.py
│ ├── model_utils.py
│ ├── gesture_rf_model.pkl
│ └── requirements.txt
│
│── tora-frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── socketContext.js
│ │ ├── App.jsx
│ │ └── index.css
│ ├── package.json
│ └── vite.config.js


---

## 🔧 Installation Guide

### 1️⃣ Backend Setup

Create virtual environment:

python -m venv venv
venv\Scripts\activate # Windows


Install dependencies:
pip install -r backend/requirements.txt


Start backend server:
cd backend
python app.py


Backend will run on:  
➡ http://localhost:5000

---

### 2️⃣ Frontend Setup

Install dependencies:
cd tora-frontend
npm install


Start frontend:


Frontend will run on:  
➡ http://localhost:5173

---

## 🧠 AI/ML Pipeline

1. **Capture hand landmarks** using Mediapipe (21 points → 63 features).  
2. **Store dataset** using `capture.py`.  
3. **Train model** on Random Forest (300 trees, max_depth=30).  
4. **Predict gestures** in real-time with stability filtering.  
5. **Stream gestures** to frontend via Socket.IO.

---

## 📊 Dataset Summary

| Gesture      | Samples |
|--------------|----------|
| zoom_in      | 200 |
| zoom_out     | 200 |
| swipe_left   | 200 |
| swipe_right  | 200 |
| fist         | 180 |
| thumbs_up    | 180 |
| no_gesture   | 250 |

Total: **1,410 samples**

Model Accuracy: **96.4%**  
Latency: **< 100ms**

---

## 🏆 Use Cases

- Operating Rooms  
- Radiology Labs  
- Sterile medical workflows  
- Touchless kiosk systems  
- Assistive technologies  

---

## Team
- Mayur Gotmare: core programming and model training
- Vedant Katre: architecture design, controller logic, documentation
- Gaurav Thakur: testing, debugging, result analysis
- Noman Kanoje: dataset preparation and interface design
