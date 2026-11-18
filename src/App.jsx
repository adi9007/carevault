import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/ui';
import { AppLayout } from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import RecordsPage from './pages/RecordsPage';
import TimelinePage from './pages/TimelinePage';
import MedicationsPage from './pages/MedicationsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import EmergencyQRPage from './pages/EmergencyQRPage';
import EmergencyViewPage from './pages/EmergencyViewPage';
import SharePage from './pages/SharePage';
import FamilyPage from './pages/FamilyPage';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// Public route wrapper (redirect if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated } = useApp();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function SettingsPage() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#163B65] mb-2">Settings</h1>
        <p className="text-[#64748B] text-sm mb-6">Manage your CareVault account preferences.</p>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center">
          <p className="text-[#64748B] text-sm">Settings panel is not included in this demonstration prototype.</p>
        </div>
      </div>
    </AppLayout>
  );
}

function AppRoutes() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Emergency view — accessible without login (limited info only) */}
        <Route path="/emergency/view/:token" element={<EmergencyViewPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute><RecordsPage /></ProtectedRoute>} />
        <Route path="/timeline" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
        <Route path="/medications" element={<ProtectedRoute><MedicationsPage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
        <Route path="/emergency" element={<ProtectedRoute><EmergencyQRPage /></ProtectedRoute>} />
        <Route path="/share" element={<ProtectedRoute><SharePage /></ProtectedRoute>} />
        <Route path="/family" element={<ProtectedRoute><FamilyPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
