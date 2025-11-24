import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const [mediaURL, setMediaURL] = useState(null);

  const dropRef = useRef(null);

  // Fade animation on load
  useEffect(() => {
    document.body.style.opacity = 1;
  }, []);

  async function analyzeFile(e) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) previewFile(dropped);
    dropRef.current.style.borderColor = "#555";
  }

  function handleDragOver(e) {
    e.preventDefault();
    dropRef.current.style.borderColor = "#00eaff";
  }

  function handleDragLeave() {
    dropRef.current.style.borderColor = "#555";
  }

  function previewFile(f) {
    setFile(f);
    setMediaURL(URL.createObjectURL(f));
  }

  const bg = dark ? "#05060a" : "#f7f7f7";
  const cardBg = dark ? "rgba(20,22,30,0.55)" : "rgba(255,255,255,0.5)";
  const text = dark ? "white" : "#111";

  const riskColor = (v) => {
    if (v > 70) return "#ff4444";
    if (v > 40) return "#ffaa00";
    return "#22dd88";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        color: text,
        padding: 30,
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        transition: ".4s",
      }}
    >

      {/* Floating particles */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "rgba(0,255,255,0.3)",
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 6}s infinite ease-in-out`,
            }}
          ></div>
        ))}

        <style>{`
          @keyframes float {
            0% { transform: translateY(0px) }
            50% { transform: translateY(-20px) }
            100% { transform: translateY(0px) }
          }
        `}</style>
      </div>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40, position: "relative", zIndex: 10 }}>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            marginBottom: 10,
            color: "#00eaff",
            textShadow: "0 0 12px #00eaff",
          }}
        >
          Deepfake Detector
        </h1>

        <p style={{ opacity: 0.8, fontSize: 16 }}>
          Upload any audio or video file — get instant AI deepfake risk analysis.
        </p>

        {/* light/dark switch */}
        <button
          onClick={() => setDark(!dark)}
          style={{
            marginTop: 20,
            background: "none",
            border: "1px solid #00eaff",
            color: "#00eaff",
            padding: "6px 14px",
            borderRadius: 8,
            cursor: "pointer",
            boxShadow: "0 0 10px #00eaff",
          }}
        >
          {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Main card */}
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: 30,
          borderRadius: 18,
          backdropFilter: "blur(18px)",
          background: cardBg,
          border: "1px solid rgba(0,255,255,0.15)",
          boxShadow: "0 0 30px rgba(0,255,255,0.1)",
          zIndex: 10,
          position: "relative",
        }}
      >
        {/* Upload Section */}
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            padding: 30,
            border: "2px dashed #555",
            borderRadius: 14,
            textAlign: "center",
            marginBottom: 25,
            transition: ".2s",
            cursor: "pointer",
            background: dark ? "#0b0d11" : "#fff",
          }}
        >
          <label htmlFor="uploader" style={{ cursor: "pointer" }}>
            <p style={{ marginBottom: 10 }}>
              {file ? <strong>{file.name}</strong> : "Drag & Drop or Click to Upload"}
            </p>
          </label>

          <input
            id="uploader"
            type="file"
            accept="audio/*,video/*"
            onChange={(e) => previewFile(e.target.files[0])}
            style={{ display: "none" }}
          />
        </div>

        {/* Preview section */}
        {mediaURL && (
          <div style={{ marginBottom: 25 }}>
            {file.type.startsWith("video") ? (
              <video src={mediaURL} controls style={{ width: "100%", borderRadius: 10 }} />
            ) : (
              <audio src={mediaURL} controls style={{ width: "100%" }} />
            )}
          </div>
        )}

        <button
          onClick={analyzeFile}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px 0",
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 12,
            background: loading ? "#333" : "#00eaff",
            color: dark ? "#000" : "#000",
            cursor: loading ? "not-allowed" : "pointer",
            border: "none",
            boxShadow: "0 0 15px #00eaff",
          }}
        >
          {loading ? "Analyzing..." : "Analyze File"}
        </button>

        {/* Loading Animation */}
        {loading && (
          <div
            style={{
              marginTop: 25,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "5px solid #00eaff",
                borderTop: "5px solid transparent",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            ></div>

            <style>{`
              @keyframes spin { 
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Result Panel */}
        {result && !loading && (
          <div style={{ marginTop: 25 }}>
            <h2 style={{ marginBottom: 15, color: "#00eaff" }}>Analysis Result</h2>

            <div style={{ marginBottom: 12 }}>
              <p>Deepfake Risk Score:</p>
              <div
                style={{
                  height: 12,
                  background: "#222",
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${result.result.risk_score}%`,
                    background: riskColor(result.result.risk_score),
                    borderRadius: 12,
                    transition: ".4s",
                  }}
                ></div>
              </div>

              <p style={{ marginTop: 6, opacity: 0.8 }}>
                {result.result.risk_score}% probability
              </p>
            </div>

            <h4 style={{ marginTop: 15, marginBottom: 8 }}>Reasons:</h4>
            <ul style={{ paddingLeft: 20 }}>
              {result.result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}