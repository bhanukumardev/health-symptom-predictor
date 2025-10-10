import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from './NotificationBell';
import InstallPWA from './InstallPWA';

const Layout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const apiUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    setPanelOpen(location.pathname === '/profile' || location.pathname === '/settings');
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const checkAdmin = async () => {
      const authToken = localStorage.getItem('token');
      if (!authToken || !apiUrl) {
        setIsAdmin(false);
        return;
      }
      try {
        console.log('🔍 Checking admin status with token:', authToken?.substring(0, 20) + '...');
        console.log('🌐 API URL:', apiUrl);
        const response = await fetch(`${apiUrl}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('📡 Response status:', response.status);
        if (response.ok) {
          const user = await response.json();
          console.log('👤 User data:', user);
          console.log('🔐 Is Admin:', user.is_admin);
          setIsAdmin(user.is_admin || false);
          try {
            if (user?.full_name) {
              localStorage.setItem('user_full_name', user.full_name);
            } else {
              localStorage.removeItem('user_full_name');
            }
          } catch (e) {
            // error handling
          }
        } else {
          console.log('❌ Response not OK');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('❌ Failed to check admin status:', error);
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [token, apiUrl]);

  const onLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAdmin(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Desktop & Mobile Header */}
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3 md:px-4">
            {/* Logo */}
            <Link to="/" className="font-semibold text-sm md:text-base truncate flex items-center gap-2">
              <span className="text-cyan-400">🏥</span>
              <span className="hidden sm:inline">{t('app.title')}</span>
              <span className="sm:hidden">Health Predictor</span>
          </Link>
          
          {/* Desktop Navigation - Hidden on Mobile */}
          <nav className="hidden md:flex gap-2 text-sm items-center">
            <Link to="/" className="btn btn-ghost">{t('nav.home')}</Link>
            <Link to="/predict" className="btn btn-ghost">{t('nav.predict')}</Link>
            <Link to="/chat" className="btn btn-ghost">💬 {t('nav.chat')}</Link>
            <Link to="/history" className="btn btn-ghost">{t('nav.history')}</Link>
            {token && <Link to="/profile" className="btn btn-ghost">👤 {t('nav.profile')}</Link>}
            {!isAdmin && <Link to="/developer" className="btn btn-ghost">👨‍💻 Developer</Link>}
            {isAdmin && <Link to="/admin" className="btn btn-ghost text-cyan-400">{t('nav.admin')}</Link>}
            {token ? (
              <>
                <NotificationBell />
                <button className="btn btn-ghost" onClick={onLogout}>{t('nav.signOut')}</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-ghost">{t('nav.signIn')}</Link>
            )}
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Controls */}
          <div className="flex md:hidden items-center gap-2">
            {token && <NotificationBell />}
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-800 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-md">
            <nav className="flex flex-col px-3 py-2 space-y-1">
              <Link to="/" className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                🏠 {t('nav.home')}
              </Link>
              <Link to="/predict" className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                🔍 {t('nav.predict')}
              </Link>
              <Link to="/chat" className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                💬 {t('nav.chat')}
              </Link>
              <Link to="/history" className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                📋 {t('nav.history')}
              </Link>
              {token && (
                <Link to="/profile" className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                  👤 {t('nav.profile')}
                </Link>
              )}
              {!isAdmin && (
                <Link to="/developer" className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                  👨‍💻 Developer
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition text-cyan-400">
                  ⚙️ {t('nav.admin')}
                </Link>
              )}
              {token ? (
                <button 
                  onClick={onLogout} 
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition text-red-400"
                >
                  🚪 {t('nav.signOut')}
                </button>
              ) : (
                <Link to="/login" className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition text-cyan-400">
                  🔐 {t('nav.signIn')}
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-3 py-4 md:px-4 md:py-8 pb-24 md:pb-8">
        {/* Add extra bottom padding for mobile to avoid overlap */}
        <div className={location.pathname === '/profile' ? 'pb-16 md:pb-0' : ''}>
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      {token && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/98 backdrop-blur-md">
          <nav className="flex items-center justify-around px-2 py-2">
            <Link 
              to="/" 
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition flex-1 ${
                location.pathname === '/' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs font-medium">{t('nav.home')}</span>
            </Link>
            <Link 
              to="/predict" 
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition flex-1 ${
                location.pathname === '/predict' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="text-xs font-medium">{t('nav.predict')}</span>
            </Link>
            <Link 
              to="/chat" 
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition flex-1 ${
                location.pathname === '/chat' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs font-medium">{t('nav.chat')}</span>
            </Link>
            <Link 
              to="/history" 
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition flex-1 ${
                location.pathname === '/history' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium">{t('nav.history')}</span>
            </Link>
            <Link 
              to="/profile" 
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition flex-1 ${
                location.pathname === '/profile' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs font-medium">{t('nav.profile')}</span>
            </Link>
          </nav>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950/95 backdrop-blur mb-16 md:mb-0">
        <div className="mx-auto max-w-5xl px-3 py-4 md:px-4">
          {/* Disclaimer Section */}
          <div className="mb-3 rounded-lg bg-slate-900/50 p-2 md:p-3 text-center text-xs text-yellow-400/90 border border-yellow-500/20">
            <strong>ℹ️</strong> {t('footer.disclaimer')}
          </div>
          {/* Footer Credit Section */}
          <div className="flex flex-col items-center justify-center gap-1 md:gap-2 text-xs md:text-sm text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 text-center">
              <span className="font-medium text-slate-300">
                Made with care by{' '}
                <Link to="/developer" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                  Bhanu Dev
                </Link>
              </span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="italic text-green-400 text-xs md:text-sm">"{t('footer.tagline')}"</span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="text-slate-500 text-xs">{t('footer.copyright')}</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {!isAdmin && (
                <Link to="/developer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  👨‍💻 Contact Developer
                </Link>
              )}
              <span className="text-slate-600">·</span>
              <a 
                href="https://github.com/bhanukumardev/health-symptom-predictor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
              >
                📖 Documentation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
      <InstallPWA />
    </>
  );
};

export default Layout;
