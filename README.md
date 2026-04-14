# 🏦 AI Finance Parser (OCR // LLM Engine)

![Production Status](https://img.shields.io/badge/Status-Live_Production-success)
![Frontend Stack](https://img.shields.io/badge/Frontend-React_%7C_Vite_%7C_Tailwind-blue)
![Backend Stack](https://img.shields.io/badge/Backend-FastAPI_%7C_Docker_%7C_Python-green)
![AI Engine](https://img.shields.io/badge/AI-Tesseract_OCR_%7C_Gemini_2.5-orange)

**Live Demo:** [Click here to view the production dashboard](https://ai-finance-parser.vercel.app/)

## 🚀 Overview
The AI Finance Parser is a full-stack, distributed application designed to solve the "unstructured data" problem in finance. It takes messy, unformatted bank statements (PDFs), extracts the raw text using a local C++ OCR engine, and uses an LLM to forcefully structure the data into a strict, predictable JSON schema.

This system is built to be hallucination-proof. If a document does not contain valid financial transactions, the engine cleanly returns an empty dataset rather than fabricating data.

## 🏗 Architecture & Tech Stack

### Frontend (The Brutalist UI)
* **Framework:** React + Vite (TypeScript)
* **Styling:** Tailwind CSS (Custom Brutalist Design System)
* **Deployment:** Vercel

### Backend (The Extraction Engine)
* **Framework:** FastAPI (Python)
* **Processing:** `pdf2image` & local Tesseract OCR engine
* **AI/LLM:** Google `genai` SDK (Gemini 2.5 Flash)
* **Infrastructure:** Dockerized container deployed on Render

## ⚙️ How It Works
1. **Ingestion:** The user uploads a PDF via the React dashboard.
2. **Transfer:** The file is sent to the FastAPI backend via a `multipart/form-data` POST request.
3. **Conversion:** `poppler` converts the PDF pages into high-resolution images.
4. **Extraction:** Tesseract scans the images and extracts the raw, unstructured text.
5. **Structuring:** The raw text is wrapped in a strict system prompt and sent to Gemini, forcing a `response_mime_type="application/json"` payload.
6. **Delivery:** The structured JSON is returned to the frontend and mapped to the UI.

## 💻 Local Development Setup

If you want to run this engine locally, you will need Tesseract and Poppler installed on your host machine.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/ai-finance-parser.git](https://github.com/your-username/ai-finance-parser.git)
cd ai-finance-parser
```

### 2. Start the Backend
Requires Python 3.10+
```bash
# Set up virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Add your Google AI API Key
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run the FastAPI server
python api.py
```

### 3. Start the Frontend
Requires Node.js 18+
```bash
cd frontend
npm install
npm run dev
```

---
*Built with modern shipping velocity.*