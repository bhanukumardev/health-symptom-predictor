import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'))
  }, [])

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-3 md:space-y-4 px-2">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
          AI-Powered Health Symptom Analysis
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Enter your symptoms and get an instant, AI-assisted assessment with actionable insights.
        </p>
        
        {/* CTA Buttons - Mobile First */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 max-w-md mx-auto">
          <Link 
            to="/predict" 
            className="btn btn-primary w-full sm:w-auto text-base py-3 sm:py-2 font-semibold"
          >
            🔍 Analyze Symptoms
          </Link>
          {!isAuthenticated && (
            <Link 
              to="/login" 
              className="btn btn-ghost w-full sm:w-auto py-3 sm:py-2"
            >
              Sign In
            </Link>
          )}
          {isAuthenticated && (
            <Link 
              to="/history" 
              className="btn btn-ghost w-full sm:w-auto py-3 sm:py-2"
            >
              📋 View History
            </Link>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-2">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">How it works</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {[
            { icon: '📝', text: 'Enter symptoms' },
            { icon: '🤖', text: 'AI analysis' },
            { icon: '📊', text: 'Get results' },
            { icon: '💬', text: 'Give feedback' }
          ].map((step, i) => (
            <div 
              key={i} 
              className="card p-4 md:p-5 text-center hover:border-cyan-500/30 transition-colors"
            >
              <div className="text-3xl md:text-4xl mb-2">{step.icon}</div>
              <p className="text-sm md:text-base font-medium">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Trust Our AI Section */}
      <section className="px-2">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Why Trust Our AI?</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[
            { icon: '🎓', title: 'Trained on medical datasets', desc: 'Built using extensive medical research' },
            { icon: '📈', title: 'Transparent confidence scores', desc: 'See how confident the AI is' },
            { icon: '🔄', title: 'Improves with feedback', desc: 'Gets better with user input' }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="card p-4 md:p-5 hover:border-cyan-500/30 transition-colors"
            >
              <div className="text-3xl md:text-4xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-sm md:text-base mb-1">{feature.title}</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Info Banner for Mobile Users */}
      <section className="px-2">
        <div className="card p-4 md:p-5 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-700/30">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">ℹ️</span>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm md:text-base">Quick & Easy Health Insights</h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Our AI analyzes your symptoms in seconds. Get personalized health recommendations, 
                medicine suggestions, and know when to seek professional care.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
