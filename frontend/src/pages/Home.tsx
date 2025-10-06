import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'))
  }, [])

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold">AI-Powered Health Symptom Analysis</h1>
        <p className="text-slate-300">Enter your symptoms and get an instant, AI-assisted assessment with actionable insights.</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/predict" className="btn btn-primary">Analyze Symptoms</Link>
          {!isAuthenticated && <Link to="/login" className="btn btn-ghost">Sign In</Link>}
          {isAuthenticated && <Link to="/history" className="btn btn-ghost">View History</Link>}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">How it works</h2>
        <div className="grid gap-3 md:grid-cols-4">
          {['Enter symptoms','AI analysis','Get results','Give feedback'].map((s,i)=> (
            <div className="card p-4" key={i}>{s}</div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Why Trust Our AI?</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="card p-4">Trained on medical datasets</div>
          <div className="card p-4">Transparent confidence scores</div>
          <div className="card p-4">Improves with feedback</div>
        </div>
      </section>
    </div>
  )
}
