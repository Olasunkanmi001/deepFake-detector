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
      const res = await fetch('http://localhost:8000/analyze', {
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
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'Inter, sans-serif' }}>
      <h1>Deepfake Detector (MVP)</h1>
      <p>Upload a short audio or video file (.wav, .mp3, .mp4) to get a risk score.</p>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*,video/*" onChange={e => setFile(e.target.files[0])} />
        <br/><br/>
        <button type="submit" disabled={loading}>{loading ? 'Analyzing...' : 'Analyze'}</button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
