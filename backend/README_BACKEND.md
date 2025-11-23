# Backend (FastAPI) - Deepfake Detector (MVP stub)

## Quick start (local)
1. Create & activate virtualenv (recommended):
   python -m venv .venv
   source .venv/bin/activate   # mac/linux
   .venv\Scripts\activate    # windows

2. Install dependencies:
   pip install -r requirements.txt

3. Run server:
   uvicorn app.main:app --reload --port 8000

4. API endpoints:
   POST /analyze  (multipart form file upload) -> returns JSON risk score
   GET  /health

## Notes
- The current /analyze endpoint uses a deterministic stub function.
- Replace `detect_deepfake_stub` in `app/main.py` with real ML model inference.
