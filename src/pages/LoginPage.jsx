import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Input, DemoNotice } from '../components/ui';

export default function LoginPage() {
  const { login, demoLogin } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate latency
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    demoLogin();
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#163B65] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#2476C7]/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#16A6A1]/20 blur-3xl" />
        </div>
        <div className="relative flex flex-col justify-center px-16 text-white">
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">CareVault</span>
          </Link>
          <h2 className="text-4xl font-extrabold mb-5 leading-tight">
            Your Health.<br />Your Records.<br />
            <span className="text-[#16A6A1]">Your Control.</span>
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed max-w-sm">
            Access your organised medical history, emergency profile, and secure sharing tools — all in one place.
          </p>
          <div className="mt-10 p-4 bg-white/10 rounded-xl border border-white/10 text-sm text-blue-200">
            <p className="font-medium text-white mb-1">Demo Account</p>
            <p>Email: demo@carevault.example</p>
            <p>Password: Demo123!</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo (mobile) */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#163B65] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#163B65]">CareVault</span>
          </Link>

          <h1 className="text-3xl font-bold text-[#163B65] mb-2">Welcome back</h1>
          <p className="text-[#64748B] mb-8">Sign in to access your health records.</p>

          <DemoNotice message="This is an academic demonstration. Use the demo account or click 'Try Demo Account' below to explore the prototype." />

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#1F2937]">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-[#E2E8F0] text-sm text-[#1F2937] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2476C7] focus:border-transparent"
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
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="rounded border-[#E2E8F0] text-[#2476C7] focus:ring-[#2476C7]"
                />
                <span className="text-sm text-[#64748B]">Remember me</span>
              </label>
              <a href="#" className="text-sm font-medium text-[#2476C7] hover:text-[#1d63a8]">Forgot password?</a>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>

            <div className="relative flex items-center">
              <div className="flex-1 border-t border-[#E2E8F0]" />
              <span className="px-4 text-xs text-[#64748B] bg-[#F5F8FC]">or</span>
              <div className="flex-1 border-t border-[#E2E8F0]" />
            </div>

            <button
              type="button"
              onClick={handleDemo}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[#2476C7]/40 bg-blue-50 text-[#2476C7] text-sm font-semibold hover:bg-blue-100 transition-colors disabled:opacity-60"
            >
              Try Demo Account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#64748B]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#2476C7] hover:text-[#1d63a8]">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
