# Student Depression Research Platform

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/ML%20Service-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Express.js](https://img.shields.io/badge/Gateway-Express.js-gray?logo=express)](https://expressjs.com/)
[![Scikit-Learn](https://img.shields.io/badge/Model-Scikit--learn%20SVM-orange?logo=scikit-learn)](https://scikit-learn.org/)
[![Deploy to Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![Deploy to Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An academic machine-learning research platform and accessible AI screening system for student depression risk assessment. Built with **Next.js 14**, an **Express.js API gateway**, and a **FastAPI inference service** hosting a trained **Scikit-learn Support Vector Classifier (SVC)** pipeline.

---

> **Responsible-Use & Ethical Notice:**  
> This platform is an **experimental academic machine-learning screening assistant**. All predictions are statistical classifications learned from a survey dataset ($N = 4,464$) and **do not constitute a medical diagnosis, clinical assessment, or treatment plan**. If a student is in psychological distress, please connect with a qualified mental health professional or counselor.

---

## Universal Model Design

The model has been refined to be **universally applicable to students worldwide**:
- Regional district/division dependencies have been **completely excluded**.
- The inference pipeline evaluates **10 universal student attributes**:
  1. Gender
  2. Age
  3. Family Financial Background
  4. Relationship Status
  5. Marital Status
  6. Living Arrangement (Family vs. Independent/Bachelor)
  7. Current Semester
  8. Cumulative GPA (CGPA)
  9. Close Supportive Friend Circle
  10. Non-Study Living Expenses

---

## Architecture Overview

```
student-depression-platform/
├── frontend/             # Next.js 14 App Router (Tailwind CSS, Cormorant Garamond, DM Sans)
├── backend/              # Express.js REST API gateway (CORS, schema forwarding, error handling)
├── ml-service/           # FastAPI service + Scikit-learn SVM pipeline artifact (.pkl)
├── render.yaml           # 1-Click Render Blueprint (ML Service + Node Backend)
└── README.md             # Project documentation & deployment guide
```

### Direct Human-Readable Output

When the form is submitted, the AI immediately outputs a direct, compassionate, human-readable status:
- **Yes — The student could be at risk of depression:** Highlights relevant stressors, explains the assessment, and provides clear, actionable support recommendations (counseling resources, workload management, peer support).
- **No — The student is unlikely to be depressed:** Reinforces positive wellbeing patterns and encourages healthy study-life balance.

---

## Local Development Quickstart

### Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **Python**: v3.10, 3.11, or 3.12
- **npm** or **pnpm**

---

### Step 1: Start Python ML Service (Port 8000)

```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

---

### Step 2: Start Express Backend Gateway (Port 5000)

Open a new terminal:

```bash
cd backend
npm install
npm run dev # or npm start
```

---

### Step 3: Start Next.js Frontend (Port 3000)

Open a third terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Deployment Guide

### Deploying Backends on Render (1-Click Blueprint)

The repository root includes a [`render.yaml`](render.yaml) specification:

1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com/), click **New +** → **Blueprint**.
3. Select your GitHub repository.
4. Render automatically provisions:
   - **`student-depression-ml`** (FastAPI service)
   - **`student-depression-backend`** (Express gateway) connected over Render's private network.
5. Copy your backend public URL (e.g. `https://student-depression-backend.onrender.com`).

---

### Deploying Frontend on Vercel

1. In [Vercel](https://vercel.com/), click **Add New...** → **Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Next.js`
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = `https://student-depression-backend.onrender.com`
5. Click **Deploy**.

---

## API Reference

### `POST /api/predict`

Generates an experimental classification for a student record.

#### Request Body
```json
{
  "Gender": "Female",
  "Age": 22,
  "Family_background": "Lower Middle class",
  "Relationship_status": "Complicated",
  "Marital_status": "Unmarried",
  "Living_style": "Bachelor",
  "Current_semester": 7,
  "CGPA": 2.9,
  "friend_circle": "No",
  "Cost_without_study": 8000
}
```

#### Field Values & Types

| Field | Type | Allowed Values / Constraints |
|---|---|---|
| `Gender` | string | `"Female"`, `"Male"` |
| `Age` | integer | `15` to `80` |
| `Family_background` | string | `"Lower Middle class"`, `"Middle class"`, `"Rich class"` |
| `Relationship_status` | string | `"Single"`, `"In a Relationship"`, `"Complicated"` |
| `Marital_status` | string | `"Unmarried"`, `"Married"`, `"Separated"` |
| `Living_style` | string | `"Family"`, `"Bachelor"` |
| `Current_semester` | integer | `1` to `20` |
| `CGPA` | float | `0.00` to `4.00` |
| `friend_circle` | string | `"Yes"`, `"No"` |
| `Cost_without_study` | float | $\ge 0$ (monthly non-academic living expenses) |

#### Response (`200 OK`)
```json
{
  "experimental_prediction": "Yes",
  "decision_score": 0.384210,
  "threshold": -0.090629,
  "disclaimer": "Experimental dataset-based classification, not a clinical diagnosis."
}
```

---

## License

This project is licensed under the [MIT License](LICENSE).
