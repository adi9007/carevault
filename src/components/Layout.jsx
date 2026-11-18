import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, FileText, Clock, Pill, Calendar,
  QrCode, Share2, Users, Settings, LogOut, ChevronRight,
  Bell, Menu, X, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Health Profile', icon: User, path: '/profile' },
  { label: 'Medical Records', icon: FileText, path: '/records' },
  { label: 'Health Timeline', icon: Clock, path: '/timeline' },
  { label: 'Medications', icon: Pill, path: '/medications' },
  { label: 'Appointments', icon: Calendar, path: '/appointments' },
  { label: 'Emergency QR', icon: QrCode, path: '/emergency' },
  { label: 'Share Records', icon: Share2, path: '/share' },
  { label: 'Family Profiles', icon: Users, path: '/family' },
];

function NavItem({ item, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
        isActive
          ? 'bg-[#2476C7]/10 text-[#2476C7]'
          : 'text-[#64748B] hover:bg-[#F5F8FC] hover:text-[#163B65]'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#2476C7]' : 'text-[#94A3B8] group-hover:text-[#163B65]'}`} />
      <span className="truncate">{item.label}</span>
      {isActive && <ChevronRight className="w-4 h-4 ml-auto text-[#2476C7]" />}
    </Link>
  );
}

export function Sidebar({ mobile = false, onClose }) {
  const { profile, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`flex flex-col h-full bg-white border-r border-[#E2E8F0] ${mobile ? 'w-full' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[#E2E8F0]">
        <Link to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-8 h-8 bg-[#163B65] rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-[#163B65]">CareVault</span>
        </Link>
        {mobile && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100" aria-label="Close menu">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1" aria-label="Main navigation">
        {navItems.map(item => (
          <NavItem key={item.path} item={item} onClick={onClose} />
        ))}
        <div className="mt-auto pt-4 border-t border-[#E2E8F0]">
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F5F8FC] hover:text-[#163B65]"
          >
            <Settings className="w-5 h-5 text-[#94A3B8]" />
            Settings
          </Link>
        </div>
      </nav>

      {/* User info */}
      <div className="px-3 py-4 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F5F8FC] group">
          <div className="w-9 h-9 rounded-full bg-[#163B65] flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">
              {profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1F2937] truncate">{profile.name}</p>
            <p className="text-xs text-[#64748B] truncate">{profile.bloodGroup} • Demo Account</p>
          </div>
          <button
            onClick={handleLogout}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export function AppLayout({ children }) {
  const { sidebarOpen, setSidebarOpen } = useApp();
  const navigate = useNavigate();
  const { logout, profile } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex h-screen bg-[#F5F8FC] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 h-full">
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center gap-4 px-6 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="hidden sm:block">
            <p className="text-sm text-[#64748B]">{getGreeting()},</p>
            <p className="text-base font-semibold text-[#163B65] -mt-0.5">{profile.name?.split(' ')[0]}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="p-2 rounded-lg hover:bg-gray-100 relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2476C7] rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-[#E2E8F0] z-50 p-4">
                  <p className="text-sm font-semibold text-[#163B65] mb-3">Notifications</p>
                  <div className="text-sm text-[#64748B] space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-[#163B65]">Upcoming appointment</p>
                      <p className="text-xs mt-0.5">Dr. Meera Shah on 20 Oct 2026 at 10:30 AM</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-[#163B65]">Demo mode active</p>
                      <p className="text-xs mt-0.5">All data is fictional for demonstration.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
