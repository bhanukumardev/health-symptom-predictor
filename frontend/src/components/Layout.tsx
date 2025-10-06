import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

export default function Layout() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isAdmin, setIsAdmin] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))
  
  useEffect(() => {
    // Check token on mount and whenever storage changes
    const checkToken = () => {
      const currentToken = localStorage.getItem('token')
      setToken(currentToken)
      if (currentToken) {
        checkAdminStatus(currentToken)
      } else {
        setIsAdmin(false)
      }
    }
    
    checkToken()
    
    // Listen for storage changes (e.g., login in another tab)
    window.addEventListener('storage', checkToken)
    
    // Also check periodically (every 2 seconds) to catch same-tab logins
    const interval = setInterval(checkToken, 2000)
    
    return () => {
      window.removeEventListener('storage', checkToken)
      clearInterval(interval)
    }
  }, [])
  
  const checkAdminStatus = async (authToken: string) => {
    try {
      console.log('🔍 Checking admin status with token:', authToken?.substring(0, 20) + '...')
      const response = await fetch('http://localhost:8000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      console.log('📡 Response status:', response.status)
      if (response.ok) {
        const user = await response.json()
        console.log('👤 User data:', user)
        console.log('🔐 Is Admin:', user.is_admin)
        setIsAdmin(user.is_admin || false)
      } else {
        console.log('❌ Response not OK')
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('❌ Failed to check admin status:', error)
      setIsAdmin(false)
    }
  }
  
  const onLogout = () => { 
    localStorage.removeItem('token')
    setToken(null)
    setIsAdmin(false)
    navigate('/login')
  }

  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="font-semibold">{t('app.title')}</Link>
          <nav className="flex gap-2 text-sm items-center">
            <Link to="/" className="btn btn-ghost">{t('nav.home')}</Link>
            <Link to="/predict" className="btn btn-ghost">{t('nav.predict')}</Link>
            <Link to="/chat" className="btn btn-ghost">💬 {t('nav.chat')}</Link>
            <Link to="/history" className="btn btn-ghost">{t('nav.history')}</Link>
            {token && <Link to="/profile" className="btn btn-ghost">👤 {t('nav.profile')}</Link>}
            {isAdmin && <Link to="/admin" className="btn btn-ghost text-cyan-400">{t('nav.admin')}</Link>}
            {token ? (
              <button className="btn btn-ghost" onClick={onLogout}>{t('nav.signOut')}</button>
            ) : (
              <Link to="/login" className="btn btn-ghost">{t('nav.signIn')}</Link>
            )}
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-8 pb-24">
        <Outlet />
      </main>
      <footer className="mt-auto border-t border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4">
          {/* Disclaimer Section */}
          <div className="mb-3 rounded-lg bg-slate-900/50 p-3 text-center text-xs text-yellow-400/90 border border-yellow-500/20">
            <strong>ℹ️</strong> {t('footer.disclaimer')}
          </div>
          
          {/* Footer Credit Section */}
          <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-medium text-slate-300">Made with care by <span className="text-cyan-400 font-bold">Bhanu Dev</span></span>
              <span className="text-slate-600">·</span>
              <span className="italic text-green-400">"{t('footer.tagline')}"</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">{t('footer.copyright')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
