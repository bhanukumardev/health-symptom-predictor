import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../lib/api-config';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const passwordValid = password.length >= 8;
  const canSubmit = emailValid && passwordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      
      // Trigger storage event for Layout to detect login
      window.dispatchEvent(new Event('storage'));
      
      navigate('/predict');
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-md px-2">
      <div className="card overflow-hidden p-4 md:p-6">
        <h2 className="mb-3 md:mb-4 text-xl md:text-2xl font-semibold text-center">
          Sign in to your account
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="email" className="label text-sm md:text-base">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="input text-base p-3"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={email.length > 0 && !emailValid}
            />
            {email.length > 0 && !emailValid && (
              <p className="text-xs text-red-400">Enter a valid email.</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="password" className="label text-sm md:text-base">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input text-base p-3 pr-20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={password.length > 0 && !passwordValid}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-cyan-400 hover:text-cyan-300"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {password.length > 0 && !passwordValid && (
              <p className="text-xs text-red-400">Minimum 8 characters.</p>
            )}
          </div>
          
          <button
            className="btn btn-primary w-full text-base py-3 font-semibold"
            type="submit"
            disabled={!canSubmit || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-4 md:mt-6 pt-4 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <span className="text-slate-400">Don't have an account?</span>
          <Link className="font-semibold text-cyan-400 hover:text-cyan-300 underline" to="/register">
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
}

