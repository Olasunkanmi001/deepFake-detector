import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return
    setLoading(true)

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: form
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, sans-serif',
        padding: 20
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background: '#1a1a1a',
          padding: 30,
          borderRadius: 12,
          boxShadow: '0 0 20px rgba(0,0,0,0.4)',
          textAlign: 'center'
        }}
      >
        <h1 style={{ marginBottom: 10, fontSize: 28, fontWeight: 700 }}>
          Deepfake Detector
        </h1>

        <p style={{ opacity: 0.8, marginBottom: 25 }}>
          Upload a short audio or video file (.wav, .mp3, .mp4) to get a risk score.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={e => setFile(e.target.files[0])}
            style={{
              width: '100%',
              padding: '10px',
              background: '#111',
              border: '1px solid #333',
              color: 'white',
              borderRadius: 8
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: 20,
              padding: '12px 0',
              borderRadius: 8,
              border: 'none',
              fontWeight: 600,
              background: loading ? '#444' : '#007bff',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: '0.2s',
              color: 'white'
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {result && (
          <div
            style={{
              marginTop: 25,
              background: '#111',
              padding: 20,
              borderRadius: 8,
              textAlign: 'left',
              border: '1px solid #333'
            }}
          >
            <h2 style={{ marginBottom: 10, fontSize: 20 }}>Result</h2>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}