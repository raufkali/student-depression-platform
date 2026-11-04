from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Student Depression Research API",
    description="Experimental Service for SVM-based Student Depression Research Prediction",
    version="1.0.0"
)

# Enable Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model artifact
MODEL_PATH = Path(__file__).parent / "student_depression_model.pkl"
artifact = joblib.load(MODEL_PATH)

model = artifact["model"]
threshold = artifact["threshold"]


class StudentData(BaseModel):
    Gender: str
    Age: int
    Family_background: str
    Relationship_status: str
    Marital_status: str
    Living_style: str
    Current_semester: int
    CGPA: float
    friend_circle: str
    Cost_without_study: float
    Home_division: str


@app.get("/")
def home():
    return {
        "status": "running",
        "service": "Student Depression Research API"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": True
    }


@app.get("/model-info")
def model_info():
    return {
        "model": artifact["model_name"],
        "threshold": threshold,
        "gender_included": artifact["gender_included"],
        "excluded_features": artifact["excluded_features"]
    }


@app.post("/predict")
def predict(student: StudentData):
    student_data = pd.DataFrame([student.model_dump()])

    score = float(model.decision_function(student_data)[0])
    prediction = "Yes" if score >= threshold else "No"

    return {
        "experimental_prediction": prediction,
        "decision_score": score,
        "threshold": threshold,
        "disclaimer": "Experimental dataset-based classification, not a clinical diagnosis."
    }
