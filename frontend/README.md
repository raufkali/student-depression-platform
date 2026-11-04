# Student Depression Research Platform — Frontend

An academic research web application for student wellbeing prediction using a trained Scikit-learn Support Vector Machine (SVM) model.

## Design Philosophy

- **Classical Editorial + Academic Research + Modern Minimalism**
- Inspired by Swiss editorial design, university research publications, and contemporary academic journals.
- Rectangular and square geometry (no pill buttons, no excessive rounded corners).
- Strict academic color tokens:
  - Background: `#F7FAF8`
  - Foreground: `#102019`
  - Emerald Accent: `#059669`
  - Secondary Emerald: `#047857`
  - Muted Text: `#65736B`
  - Border: `#DCE5DF`
  - Surface: `#FFFFFF`
  - Subtle Section: `#EEF4F0`
- Clear distinction between predictive correlations and medical diagnosis.

## Application Architecture

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout with fonts, metadata, and design tokens
│   │   ├── page.js            # Modular single-page editorial research composition
│   │   └── globals.css        # CSS variables, typography rules, square styling
│   ├── components/
│   │   ├── Navbar.js          # Typographic navigation bar
│   │   ├── Hero.js            # Editorial hero with coordinate hyperplane annotation
│   │   ├── ResearchOverview.js # Three foundational numbered research principles
│   │   ├── AssessmentForm.js  # 11-attribute research assessment form with benchmarks
│   │   ├── PredictionResult.js # Restrained classification output & decision boundary scale
│   │   ├── Methodology.js     # 9-point scientific documentation & fairness audit
│   │   ├── About.js           # Research scope, ethics, and non-diagnostic boundaries
│   │   └── Footer.js          # Minimalist footer with disclaimer and navigation
│   └── lib/
│       └── api.js             # Client API integration with validation & error handling
├── .env.local                 # Local environment variables (NEXT_PUBLIC_API_URL)
├── .env.example               # Example environment configuration
├── package.json               # Dependencies and build scripts
└── tailwind.config.js         # Tailwind configuration with design tokens
```

## Running the Application

### 1. Environment Configuration

Ensure `.env.local` is present in the `frontend/` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

### 4. Production Build & Start

```bash
npm run build
npm run start
```

## Services Dependency

The frontend expects:
1. **Python ML Inference Service** running on `http://127.0.0.1:8000` (FastAPI).
2. **Express Backend API** running on `http://localhost:5000`.
