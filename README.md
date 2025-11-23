# Deepfake Voice & Video Authentication Detector (MVP)

This repository contains a minimal, runnable MVP for a deepfake detection system:
- backend/: FastAPI backend with a deterministic stub detector (replace with a real model)
- frontend/: Next.js frontend to upload files and show detection results

## Quickstart (recommended order)
1. Backend
   cd backend
   python -m venv .venv
   source .venv/bin/activate   # or .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000

2. Frontend (in a separate terminal)
   cd frontend
   npm install
   npm run dev
   Open http://localhost:3000

## Next steps to integrate ML models
- Install torch/opencv and load your pre-trained audio/video detection models in backend/app/main.py
- Replace detect_deepfake_stub with model inference and post-processing
- Consider using GPU for training and inference, or use a model server (TorchServe, Triton)

## License
MIT
