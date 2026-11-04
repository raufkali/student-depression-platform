from pathlib import Path
from typing import Optional

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Student Depression Research API",
    description="Universal SVM-based Student Depression Research Prediction Service",
    version="1.1.0"
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

FEATURE_COLUMNS = [
    "Gender",
    "Age",
    "Family_background",
    "Relationship_status",
    "Marital_status",
    "Living_style",
    "Current_semester",
    "CGPA",
    "friend_circle",
    "Cost_without_study"
]


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
    Home_division: Optional[str] = None


@app.get("/")
def home():
    return {
        "status": "running",
        "service": "Student Depression Research API",
        "version": "1.1.0",
        "features": FEATURE_COLUMNS
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
    data_dict = student.model_dump()
    student_df = pd.DataFrame([{col: data_dict[col] for col in FEATURE_COLUMNS}])

    score = float(model.decision_function(student_df)[0])
    prediction = "Yes" if score >= threshold else "No"

    return {
        "experimental_prediction": prediction,
        "decision_score": score,
        "threshold": threshold,
        "disclaimer": "Experimental dataset-based classification, not a clinical diagnosis."
    }
