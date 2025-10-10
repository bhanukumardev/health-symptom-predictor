import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../lib/api-config';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState(''); // Weight in kg for personalized dosage
  const [height, setHeight] = useState(''); // Height in cm for BMI
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const passwordValid = password.length >= 8;
  const match = confirm === password && passwordValid;
  const canSubmit = name.trim().length > 1 && emailValid && passwordValid && match;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: name,
          age: age ? parseInt(age) : undefined,
          gender: gender || undefined,
          weight: weight ? parseFloat(weight) : undefined,
          height: height ? parseFloat(height) : undefined,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Registration failed');
      }
      
      alert('Account created! You can now sign in.');
      navigate('/login');
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
          Create your account
        </h2>
        <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="name" className="label text-sm md:text-base">
              Full Name
            </label>
            <input 
              id="name" 
              className="input text-base p-3" 
              placeholder="John Doe"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="email" className="label text-sm md:text-base">
              Email Address
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
          
          {/* Optional Health Info Section */}
          <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <p className="text-xs md:text-sm text-slate-400 mb-3 flex items-start gap-2">
              <span>💡</span>
              <span>Optional: Add health info for personalized recommendations</span>
            </p>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div className="grid gap-1.5">
                <label htmlFor="age" className="label text-xs md:text-sm">Age</label>
                <input 
                  id="age" 
                  type="number" 
                  className="input text-sm md:text-base p-2 md:p-3" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)} 
                  placeholder="25" 
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="gender" className="label text-xs md:text-sm">Gender</label>
                <select 
                  id="gender" 
                  className="input text-sm md:text-base p-2 md:p-3" 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-3 mt-2 md:mt-3">
              <div className="grid gap-1.5">
                <label htmlFor="weight" className="label text-xs md:text-sm">Weight (kg)</label>
                <input 
                  id="weight" 
                  type="number" 
                  step="0.1"
                  className="input text-sm md:text-base p-2 md:p-3" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)} 
                  placeholder="65.5"
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="height" className="label text-xs md:text-sm">Height (cm)</label>
                <input 
                  id="height" 
                  type="number" 
                  step="0.1"
                  className="input text-sm md:text-base p-2 md:p-3" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)} 
                  placeholder="170"
                />
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="password" className="label text-sm md:text-base">Password</label>
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
          
          <div className="grid gap-2">
            <label htmlFor="confirm" className="label text-sm md:text-base">
              Confirm Password
            </label>
            <input 
              id="confirm" 
              type={showPassword ? 'text' : 'password'} 
              className="input text-base p-3" 
              placeholder="••••••••"
              value={confirm} 
              onChange={(e) => setConfirm(e.target.value)} 
              aria-invalid={confirm.length > 0 && !match} 
            />
            {confirm.length > 0 && !match && (
              <p className="text-xs text-red-400">Passwords must match.</p>
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
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="mt-4 md:mt-6 pt-4 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <span className="text-slate-400">Already have an account?</span>
          <Link className="font-semibold text-cyan-400 hover:text-cyan-300 underline" to="/login">
            Sign in now
          </Link>
        </div>
      </div>
    </div>
  );
}
