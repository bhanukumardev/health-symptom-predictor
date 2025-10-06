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
    <div className="mx-auto grid w-full max-w-md">
      <div className="card overflow-hidden p-6">
        <h2 className="mb-4 text-2xl font-semibold">Create your account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="name" className="label">Full Name</label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="email" className="label">Email Address</label>
            <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={email.length > 0 && !emailValid} />
            {email.length > 0 && !emailValid && (
              <p className="text-xs text-red-400">Enter a valid email.</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="age" className="label">Age (Optional)</label>
            <input id="age" type="number" className="input" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter your age" />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="gender" className="label">Gender (Optional)</label>
            <select id="gender" className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select</option>
              <option value="F">Female</option>
              <option value="M">Male</option>
              <option value="O">Other</option>
            </select>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="weight" className="label">
              Weight in kg (Optional)
              <span className="ml-2 text-xs text-slate-400">For personalized medicine dosage</span>
            </label>
            <input 
              id="weight" 
              type="number" 
              step="0.1"
              className="input" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
              placeholder="e.g., 65.5"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="password" className="label">Password</label>
            <div className="flex gap-2">
              <input id="password" type={showPassword ? 'text' : 'password'} className="input" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={password.length > 0 && !passwordValid} />
              <button type="button" className="btn btn-ghost" onClick={() => setShowPassword((s) => !s)} aria-pressed={showPassword}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
            {password.length > 0 && !passwordValid && (
              <p className="text-xs text-red-400">Minimum 8 characters.</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="confirm" className="label">Confirm Password</label>
            <input id="confirm" type={showPassword ? 'text' : 'password'} className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-invalid={confirm.length > 0 && !match} />
            {confirm.length > 0 && !match && (
              <p className="text-xs text-red-400">Passwords must match.</p>
            )}
          </div>
          
          <button className="btn btn-primary w-full" type="submit" disabled={!canSubmit || loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>
        </form>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <span>Already have an account?</span>
          <Link className="underline" to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
