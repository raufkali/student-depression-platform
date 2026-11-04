# Student Depression Research Platform

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/ML%20Service-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Express.js](https://img.shields.io/badge/Gateway-Express.js-gray?logo=express)](https://expressjs.com/)
[![Scikit-Learn](https://img.shields.io/badge/Model-Scikit--learn%20SVM-orange?logo=scikit-learn)](https://scikit-learn.org/)
[![Deploy to Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![Deploy to Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An academic machine-learning research platform and prediction system studying patterns in student demographic, academic, and socio-economic survey data. The platform features an end-to-end production architecture: a **Next.js 14** editorial frontend, an **Express.js** gateway, and a **FastAPI** inference service hosting a trained **Scikit-learn Support Vector Classifier (SVC)** pipeline.

---

> **Responsible-Use & Ethical Notice:**  
> This platform is an **experimental academic machine-learning research project**. All predictions are statistical classifications learned from a retrospective survey dataset ($N = 4,464$) and **do not constitute a medical diagnosis, clinical assessment, or treatment recommendation**. The model has not been clinically validated.

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

### Data & Request Flow

```
[ User Browser ]
       │
       ▼ (HTTP POST /api/predict)
[ Next.js Frontend (Vercel) ]
       │
       ▼ (HTTP POST ${NEXT_PUBLIC_API_URL}/api/predict)
[ Express API Gateway (Render) ]
       │
       ▼ (HTTP POST ${ML_SERVICE_URL}/predict)
[ FastAPI ML Service (Render) ]
       │
       ▼ (Feature Preprocessing Pipeline: StandardScaler + OneHotEncoder)
[ Trained SVC Model (C=1, Balanced Weights, Threshold τ = -0.1596) ]
```

---

## Design System & Editorial Philosophy

The frontend is intentionally designed as an **editorial academic research publication** rather than a generic SaaS dashboard:

- **Typography:** Cormorant Garamond (headlines) + DM Sans (body and form interface) + Manrope (editorial accents).
- **Geometry:** Square corners and rectangular geometry (`rounded-none` or max `2px` radius) with hairline 1px borders (`#DCE5DF`).
- **Color Palette:**
  - Background: `#F7FAF8`
  - Foreground: `#102019`
  - Emerald Accent: `#059669`
  - Secondary Emerald: `#047857`
  - Muted Text: `#65736B`
  - Surface: `#FFFFFF`
  - Subtle Section: `#EEF4F0`
- **Zero Distractions:** No gradients, glowing neon blobs, glassmorphism, or non-functional decorative cards.

---

## Machine Learning & Research Methodology

The model and empirical findings are documented in the project research notebook:

1. **Cohort Demographics:** $N = 4,464$ university student records collected across Bangladesh's 8 administrative divisions (Barisal, Chittagong, Dhaka, Khulna, Mymensingh, Rajshahi, Rangpur, Sylhet).
2. **Target Leakage Protocol:** Preliminary models achieved artificial $\sim 99.7\%$ accuracy due to severe data leakage in the `Health_condition` attribute (100% of 'Critical' cases were depressed; 100% of 'Good' cases were non-depressed). Purging this feature returned the model to an authentic, realistic baseline of **$66.5\%$ accuracy ($F_1: 0.41$)**.
3. **Model Selection:** Across Stratified 5-Fold Cross Validation without leakage:
   - **Support Vector Classifier (SVC)**: Accuracy $66.47\%$, Precision $42.76\%$, Recall $72.60\%$, $F_1: 53.79\%$, ROC-AUC $0.7392$.
   - Logistic Regression: Accuracy $63.19\%$, Recall $71.52\%$, $F_1: 51.11\%$.
   - Random Forest: Accuracy $74.26\%$, Recall $31.72\%$, $F_1: 39.83\%$.
   - Gradient Boosting: Accuracy $75.02\%$, Recall $21.56\%$, $F_1: 31.63\%$.
4. **Validation-Based Threshold Calibration:** Default threshold ($0.0$) was optimized via precision-recall curves to **$\tau = -0.1596$**, maximizing positive-class sensitivity/recall ($76.0\%$) for screening evaluation.
5. **Algorithmic Fairness Audit:** Audited Model A (with Gender) vs. Model B (without Gender). Removing Gender decreased female recall from $70.5\%$ to $66.7\%$ and spiked male false positive rates from $46.8\%$ to $54.6\%$. Model A was retained with documented fairness limitations.
6. **Permutation Importance:** Key contributors to decision scores are `Relationship_status`, `CGPA`, `Family_background`, `Gender`, and `Cost_without_study`.

---

## Local Development Quickstart

### Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **Python**: v3.10, 3.11, or 3.12
- **npm** or **pnpm**

---

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/student-depression-platform.git
cd student-depression-platform
```

---

### Step 2: Start Python ML Service (Port 8000)

```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Verify the ML service:
```bash
curl http://127.0.0.1:8000/health
# {"status":"healthy","model_loaded":true}
```

---

### Step 3: Start Express Backend Gateway (Port 5000)

Open a new terminal:

```bash
cd backend
npm install
npm run dev # or npm start
```

Verify backend connection:
```bash
curl http://localhost:5000/health
# {"status":"healthy","uptime":...}
```

---

### Step 4: Start Next.js Frontend (Port 3000)

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

This repository is preconfigured for **zero-friction deployment** to **Render** (backends) and **Vercel** (frontend).

### Option A: Render Blueprint (1-Click for Backends)

The repository root includes a [`render.yaml`](render.yaml) specification:

1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com/), click **New +** → **Blueprint**.
3. Select your GitHub repository.
4. Render automatically provisions:
   - **`student-depression-ml`** (Python Web Service)
   - **`student-depression-backend`** (Node Web Service) connected over Render's private internal network.
5. Note the public URL of the backend (e.g. `https://student-depression-backend.onrender.com`).

---

### Option B: Manual Render Setup

#### 1. Deploy ML Service on Render:
- **Service Type:** Web Service
- **Root Directory:** `ml-service`
- **Environment:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path:** `/health`

#### 2. Deploy Express Backend on Render:
- **Service Type:** Web Service
- **Root Directory:** `backend`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Health Check Path:** `/health`
- **Environment Variable:**
  - `ML_SERVICE_URL`: URL of the deployed ML service (e.g. `https://student-depression-ml.onrender.com`)

---

### Option C: Deploy Frontend on Vercel

1. In [Vercel](https://vercel.com/), click **Add New...** → **Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click Edit and select `frontend`
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed Express backend (e.g. `https://student-depression-backend.onrender.com`)
5. Click **Deploy**.

---

## API Reference

### `POST /api/predict`

Generates an experimental classification for a submitted student record.

#### Request Headers
```http
Content-Type: application/json
```

#### Request Body
```json
{
  "Gender": "Female",
  "Age": 22,
  "Family_background": "Middle class",
  "Relationship_status": "Single",
  "Marital_status": "Unmarried",
  "Living_style": "Family",
  "Current_semester": 7,
  "CGPA": 3.5,
  "friend_circle": "Yes",
  "Cost_without_study": 5000,
  "Home_division": "Dhaka"
}
```

#### Field Values & Types

| Field | Type | Allowed Values / Constraints |
|---|---|---|
| `Gender` | string | `"Female"`, `"Male"` |
| `Age` | integer | `16` to `80` |
| `Family_background` | string | `"Lower Middle class"`, `"Middle class"`, `"Rich class"` |
| `Relationship_status` | string | `"Single"`, `"In a Relationship"`, `"Complicated"` |
| `Marital_status` | string | `"Unmarried"`, `"Married"`, `"Separated"` |
| `Living_style` | string | `"Family"`, `"Bachelor"` |
| `Current_semester` | integer | `1` to `20` |
| `CGPA` | float | `0.00` to `4.00` |
| `friend_circle` | string | `"Yes"`, `"No"` |
| `Cost_without_study` | float | $\ge 0$ (monthly non-academic expenses in BDT) |
| `Home_division` | string | `"Barisal"`, `"Chittagong"`, `"Dhaka"`, `"Khulna"`, `"Mymensingh"`, `"Rajshahi"`, `"Rangpur"`, `"Sylhet"` |

#### Response (`200 OK`)
```json
{
  "experimental_prediction": "Yes",
  "decision_score": 0.3386324735223376,
  "threshold": -0.15960504130427508,
  "disclaimer": "Experimental dataset-based classification, not a clinical diagnosis."
}
```

#### Response (`503 Service Unavailable`)
```json
{
  "error": "ML prediction service is unavailable."
}
```

---

## License

This project is licensed under the [MIT License](LICENSE).
Academic and research usage is encouraged with appropriate citation.
