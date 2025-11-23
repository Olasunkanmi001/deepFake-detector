from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import hashlib

app = FastAPI(title="Deepfake Detector (MVP stub)")

# -----------------------------
# ✅ CORS CONFIGURATION (Step 4)
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------
# Deepfake Stub Detection (no change)
# ---------------------------------------
def detect_deepfake_stub(file_bytes: bytes) -> dict:
    h = hashlib.sha256(file_bytes).hexdigest()
    val = int(h[:8], 16) % 101

    reason = []
    size = len(file_bytes)

    if size < 20_000:
        reason.append("Very short audio/video — may be low-fidelity.")

    if val > 80:
        reason.append("High pattern repetition detected (stub).")
    elif val > 50:
        reason.append("Some suspicious artifacts detected (stub).")
    else:
        reason.append("No strong AI-fingerprint found (stub).")

    return {"risk_score": val, "reasons": reason}

# ---------------------------------------
# Analyze endpoint
# ---------------------------------------
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()
    result = detect_deepfake_stub(contents)
    return JSONResponse({"filename": file.filename, "result": result})

# ---------------------------------------
# Health check endpoint
# ---------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok"}
