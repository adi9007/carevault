import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, User, FileText, Clock, Pill, QrCode, Share2,
  ChevronRight, CheckCircle, Lock, Heart, Menu, X,
  ArrowRight, Zap, Activity
} from 'lucide-react';

const features = [
  {
    icon: User,
    title: 'Personal Health Profile',
    desc: 'Keep your essential health information — blood group, allergies, and medical history — organised and accessible in one place.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: FileText,
    title: 'Medical Records',
    desc: 'Organise prescriptions, lab reports, imaging results, and discharge summaries by type and date.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Clock,
    title: 'Health Timeline',
    desc: 'View your entire medical history in a clear chronological timeline with linked documents.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: Pill,
    title: 'Medication Manager',
    desc: 'Track current and past medications, dosage schedules, and prescribing clinicians.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: QrCode,
    title: 'Emergency QR',
    desc: 'Provide first responders access to a limited, essential health summary via a secure QR profile.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: Share2,
    title: 'Secure Record Sharing',
    desc: 'Select specific records and configure read-only, time-limited access links for healthcare providers.',
    color: 'bg-green-50 text-green-600',
  },
];

const steps = [
  { num: '01', title: 'Create your health profile', desc: 'Register and fill in your essential health details — blood group, allergies, and contact information.' },
  { num: '02', title: 'Organise your medical records', desc: 'Upload and categorise your lab reports, prescriptions, and documents in one secure location.' },
  { num: '03', title: 'Access and share when needed', desc: 'View your health timeline, generate an emergency QR, or create time-limited share links for providers.' },
];

const benefits = [
  { icon: FileText, label: 'Centralised Health Records' },
  { icon: Share2, label: 'Patient-Controlled Sharing' },
  { icon: Clock, label: 'Organised Medical Timeline' },
  { icon: QrCode, label: 'Emergency Information Access' },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1F2937]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#163B65] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#163B65]">CareVault</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'How It Works', 'Security', 'About'].map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-medium text-[#64748B] hover:text-[#163B65] transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-[#163B65] hover:text-[#2476C7] transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-[#2476C7] text-white text-sm font-medium hover:bg-[#1d63a8] transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pb-4 pt-3 space-y-2">
            {['Features', 'How It Works', 'Security', 'About'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-3 py-2 text-sm font-medium text-[#64748B] hover:text-[#163B65] rounded-lg hover:bg-[#F5F8FC]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#E2E8F0]">
              <Link to="/login" className="px-3 py-2.5 text-sm font-medium text-center text-[#163B65] border border-[#E2E8F0] rounded-lg hover:bg-[#F5F8FC]">
                Log In
              </Link>
              <Link to="/register" className="px-3 py-2.5 text-sm font-medium text-center bg-[#2476C7] text-white rounded-lg hover:bg-[#1d63a8]">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#163B65] via-[#1a4a7a] to-[#163B65] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-[#2476C7] blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-[#16A6A1] blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm font-medium text-blue-200 mb-6">
                <Activity className="w-4 h-4" />
                Academic Demonstration Prototype
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Your Health Records,{' '}
                <span className="text-[#16A6A1]">All in One Place.</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-xl">
                Organise your medical history, access important health information, and share selected records when you need them.
                CareVault puts your health information within reach.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2476C7] hover:bg-[#1d63a8] text-white font-semibold rounded-xl shadow-lg transition-all"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
                >
                  Explore Features
                </a>
              </div>

              {/* Benefits row */}
              <div className="mt-12 grid grid-cols-2 gap-3">
                {benefits.map(b => (
                  <div key={b.label} className="flex items-center gap-2 text-sm text-blue-100">
                    <CheckCircle className="w-4 h-4 text-[#16A6A1] flex-shrink-0" />
                    {b.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dashboard mockup */}
            <div className="hidden lg:block">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-[#F5F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#163B65] mb-4">
              Everything you need to manage your health
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto text-lg">
              CareVault brings together the tools patients need to stay organised and informed.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-2xl p-7 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#163B65] mb-2">{f.title}</h3>
                  <p className="text-[#64748B] text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#163B65] mb-4">How CareVault Works</h2>
            <p className="text-[#64748B] max-w-xl mx-auto text-lg">Getting started takes just a few minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-12 left-[33%] right-[33%] h-0.5 bg-[#E2E8F0]" />
            {steps.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#F5F8FC] border-4 border-[#E2E8F0] flex items-center justify-center mb-6 z-10 relative">
                  <span className="text-2xl font-extrabold text-[#2476C7]">{step.num}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#163B65] mb-2">{step.title}</h3>
                <p className="text-[#64748B] text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy / Security */}
      <section id="security" className="py-24 bg-[#163B65] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-8 h-8 text-[#16A6A1]" />
                <span className="text-[#16A6A1] font-semibold uppercase tracking-wide text-sm">Privacy First Design</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Your Health Information Deserves Care.</h2>
              <p className="text-blue-200 text-lg leading-relaxed mb-6">
                CareVault is designed around patient control: you decide what to store, what to share, and for how long.
                The Emergency QR discloses only a minimal, pre-approved set of essential fields.
              </p>
              <p className="text-blue-200 text-lg leading-relaxed">
                This prototype is an academic demonstration. It is designed around the principles of controlled access,
                limited information disclosure, and patient choice — without making claims about regulatory approval or production-grade security.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { icon: Shield, label: 'Patient-Controlled Access', desc: 'You choose what information to share and with whom.' },
                { icon: Lock, label: 'Selective Disclosure', desc: 'Emergency QR reveals only essential fields, not your full records.' },
                { icon: Clock, label: 'Time-Limited Sharing', desc: 'Share links expire automatically after your chosen duration.' },
                { icon: Zap, label: 'Demo Mode Transparency', desc: 'This prototype uses fictional data and simulated interactions.' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-white/10 rounded-xl p-5 border border-white/10">
                    <Icon className="w-6 h-6 text-[#16A6A1] mb-3" />
                    <h3 className="text-sm font-semibold mb-1">{item.label}</h3>
                    <p className="text-xs text-blue-200">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="py-24 bg-[#F5F8FC]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Heart className="w-12 h-12 text-[#2476C7] mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-[#163B65] mb-4">Try the Demo</h2>
          <p className="text-[#64748B] text-lg mb-8">
            Explore the full CareVault prototype using the demo account. No real data is collected.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#163B65] hover:bg-[#0f2847] text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              Open Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 border border-[#E2E8F0] bg-white text-[#163B65] font-semibold rounded-xl hover:bg-[#F5F8FC] transition-all shadow-sm"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#163B65] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CareVault</span>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
                A patient-centric digital health platform for organising medical records, timelines, and emergency information.
              </p>
              <p className="text-blue-300 text-xs mt-4 italic">
                ⚠ Academic Demonstration Prototype — All data is fictional.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Platform</h3>
              <div className="space-y-2">
                {[
                  { label: 'Dashboard', to: '/dashboard' },
                  { label: 'Medical Records', to: '/records' },
                  { label: 'Health Timeline', to: '/timeline' },
                  { label: 'Emergency QR', to: '/emergency' },
                  { label: 'Share Records', to: '/share' },
                ].map(item => (
                  <Link key={item.label} to={item.to} className="block text-sm text-blue-300 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Legal</h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-blue-300 hover:text-white">Privacy Policy</a>
                <a href="#" className="block text-sm text-blue-300 hover:text-white">Terms of Use</a>
                <a href="mailto:demo@carevault.example" className="block text-sm text-blue-300 hover:text-white">Contact</a>
              </div>
              <div className="mt-6 p-3 bg-white/10 rounded-lg text-xs text-blue-200">
                Final-year Computer Engineering project. Not a production healthcare service.
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-xs text-blue-400">
            © 2026 CareVault — Academic Demonstration Prototype. All patient information is entirely fictional.
          </div>
        </div>
      </footer>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-2xl">
      {/* Mini header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-white">CareVault</span>
        <div className="ml-auto flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Medical Records', value: '12', color: 'bg-blue-500/20 text-blue-200' },
          { label: 'Medications', value: '2', color: 'bg-teal-500/20 text-teal-200' },
          { label: 'Appointments', value: '1', color: 'bg-purple-500/20 text-purple-200' },
          { label: 'Health Events', value: '8', color: 'bg-orange-500/20 text-orange-200' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-3`}>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent records */}
      <div className="bg-white/10 rounded-xl p-3 mb-3">
        <p className="text-xs text-blue-200 font-medium mb-2">Recent Records</p>
        {[
          'Complete Blood Count',
          'General Consultation',
          'Lipid Profile',
        ].map(r => (
          <div key={r} className="flex items-center gap-2 py-1.5 border-b border-white/10 last:border-0">
            <div className="w-1.5 h-1.5 rounded-full bg-[#16A6A1]" />
            <p className="text-xs text-white/90 truncate">{r}</p>
          </div>
        ))}
      </div>

      {/* Emergency QR mini */}
      <div className="bg-[#16A6A1]/20 border border-[#16A6A1]/30 rounded-xl p-3 flex items-center gap-3">
        <QrCode className="w-6 h-6 text-[#16A6A1]" />
        <div>
          <p className="text-xs font-semibold text-white">Emergency QR Active</p>
          <p className="text-xs text-blue-200">Demo profile ready</p>
        </div>
      </div>
    </div>
  );
}
