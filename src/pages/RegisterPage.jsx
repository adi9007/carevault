import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Input, DemoNotice } from '../components/ui';

export default function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', agreed: false });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email address.';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.';
    if (!form.agreed) errs.agreed = 'You must acknowledge the demo notice.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setSuccess(true);
    await new Promise(r => setTimeout(r, 1200));
    register({ name: form.name, email: form.email });
    setLoading(false);
    navigate('/dashboard');
  };

  const passwordStrength = () => {
    const p = form.password;
    if (p.length === 0) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];
    return { score, label: labels[score - 1] || 'Weak', color: colors[score - 1] || 'bg-red-400' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#163B65] rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-[#163B65]">CareVault</span>
        </Link>

        <h1 className="text-3xl font-bold text-[#163B65] mb-2">Create account</h1>
        <p className="text-[#64748B] mb-6">Start organising your health records today.</p>

        <DemoNotice message="This is an academic demonstration prototype. Account creation is simulated — no real data is stored or transmitted." />

        {success && (
          <div className="mt-4 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm font-medium">Account created! Redirecting to your dashboard…</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <Input
            id="name"
            label="Full name"
            type="text"
            placeholder="Aarav Sharma"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            error={errors.name}
            autoComplete="name"
          />

          <Input
            id="reg-email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-password" className="text-sm font-medium text-[#1F2937]">Password</label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                autoComplete="new-password"
                className={`w-full px-3 py-2.5 pr-10 rounded-lg border text-sm text-[#1F2937] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2476C7] focus:border-transparent ${errors.password ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'}`}
              />
              <button
                type="button"
                onClick={() => setShowPass(o => !o)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {strength && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.color : 'bg-[#E2E8F0]'}`} />
                  ))}
                </div>
                <span className="text-xs text-[#64748B]">{strength.label}</span>
              </div>
            )}
            {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
          </div>

          <Input
            id="confirm"
            label="Confirm password"
            type={showPass ? 'text' : 'password'}
            placeholder="Repeat password"
            value={form.confirm}
            onChange={e => update('confirm', e.target.value)}
            error={errors.confirm}
            autoComplete="new-password"
          />

          <div className="flex flex-col gap-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreed}
                onChange={e => update('agreed', e.target.checked)}
                className="mt-1 rounded border-[#E2E8F0] text-[#2476C7] focus:ring-[#2476C7]"
              />
              <span className="text-sm text-[#64748B]">
                I acknowledge that this is an academic demonstration prototype and that all patient information used is fictional. No real health data should be entered.
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-red-600 ml-6">{errors.agreed}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#64748B]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#2476C7] hover:text-[#1d63a8]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
