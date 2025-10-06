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
    <div className="mx-auto grid w-full max-w-md">
      <div className="card overflow-hidden p-6">
        <h2 className="mb-4 text-2xl font-semibold">Sign in to your account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="email" className="label">Email address</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={email.length > 0 && !emailValid}
            />
            {email.length > 0 && !emailValid && (
              <p className="text-xs text-red-400">Enter a valid email.</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="password" className="label">Password</label>
            <div className="flex gap-2">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={password.length > 0 && !passwordValid}
              />
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {password.length > 0 && !passwordValid && (
              <p className="text-xs text-red-400">Minimum 8 characters.</p>
            )}
          </div>
          
          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={!canSubmit || loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <span>Don't have an account?</span>
          <Link className="underline" to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}

