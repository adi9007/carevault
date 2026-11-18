import { createContext, useContext, useState, useEffect } from 'react';
import {
  DEMO_USER, MEDICAL_RECORDS, TIMELINE_EVENTS, MEDICATIONS,
  APPOINTMENTS, FAMILY_PROFILES, SHARED_RECORDS, EMERGENCY_QR_TOKEN
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(DEMO_USER);
  const [records, setRecords] = useState(MEDICAL_RECORDS);
  const [timeline, setTimeline] = useState(TIMELINE_EVENTS);
  const [medications, setMedications] = useState(MEDICATIONS);
  const [appointments, setAppointments] = useState(APPOINTMENTS);
  const [familyProfiles] = useState(FAMILY_PROFILES);
  const [sharedLinks, setSharedLinks] = useState(SHARED_RECORDS);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [qrToken] = useState(EMERGENCY_QR_TOKEN);

  // Check for saved session
  useEffect(() => {
    const saved = localStorage.getItem('cv_session');
    if (saved) {
      try {
        const session = JSON.parse(saved);
        if (session.isAuthenticated) {
          setIsAuthenticated(true);
          setCurrentUser(session.user);
        }
      } catch {
        localStorage.removeItem('cv_session');
      }
    }
  }, []);

  const login = (email, password) => {
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      setIsAuthenticated(true);
      setCurrentUser(DEMO_USER);
      localStorage.setItem('cv_session', JSON.stringify({ isAuthenticated: true, user: DEMO_USER }));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password. Try the demo account.' };
  };

  const demoLogin = () => {
    setIsAuthenticated(true);
    setCurrentUser(DEMO_USER);
    localStorage.setItem('cv_session', JSON.stringify({ isAuthenticated: true, user: DEMO_USER }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('cv_session');
  };

  const register = (data) => {
    // Simulated registration — accepts any valid data in demo mode
    setIsAuthenticated(true);
    const newUser = { ...DEMO_USER, name: data.name, email: data.email };
    setCurrentUser(newUser);
    localStorage.setItem('cv_session', JSON.stringify({ isAuthenticated: true, user: newUser }));
    return { success: true };
  };

  const updateProfile = (updatedData) => {
    setProfile(prev => ({ ...prev, ...updatedData }));
    addToast('Profile updated successfully.', 'success');
  };

  const addRecord = (record) => {
    const newRecord = {
      ...record,
      id: `rec-${Date.now()}`,
      date: record.date || new Date().toISOString().split('T')[0],
    };
    setRecords(prev => [newRecord, ...prev]);
    // Also add a timeline event
    const timelineEvent = {
      id: `tl-${Date.now()}`,
      date: newRecord.date,
      category: newRecord.type || 'Other',
      title: newRecord.title,
      description: `${newRecord.type} added.`,
      linkedRecordId: newRecord.id,
      icon: 'file',
    };
    setTimeline(prev => [timelineEvent, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
    addToast('Record uploaded successfully.', 'success');
    return newRecord;
  };

  const deleteRecord = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    setTimeline(prev => prev.filter(t => t.linkedRecordId !== id));
    addToast('Record deleted.', 'info');
  };

  const addMedication = (med) => {
    const newMed = { ...med, id: `med-${Date.now()}` };
    setMedications(prev => [newMed, ...prev]);
    addToast('Medication added.', 'success');
  };

  const updateMedication = (id, data) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    addToast('Medication updated.', 'success');
  };

  const deleteMedication = (id) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    addToast('Medication removed.', 'info');
  };

  const addAppointment = (appt) => {
    const newAppt = { ...appt, id: `appt-${Date.now()}`, status: 'Upcoming' };
    setAppointments(prev => [newAppt, ...prev]);
    addToast('Appointment added.', 'success');
  };

  const updateAppointment = (id, data) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    addToast('Appointment updated.', 'success');
  };

  const cancelAppointment = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    addToast('Appointment cancelled.', 'info');
  };

  const createShareLink = (selectedIds, expiry, permission) => {
    const expiryMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
    };
    const newLink = {
      id: `share-${Date.now()}`,
      token: `cv-share-${Math.random().toString(36).substring(2, 10)}`,
      recordIds: selectedIds,
      permission,
      expiry,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (expiryMs[expiry] || expiryMs['24h'])).toISOString(),
      status: 'Active',
    };
    setSharedLinks(prev => [newLink, ...prev]);
    addToast('Demo share link created.', 'success');
    return newLink;
  };

  const revokeShareLink = (id) => {
    setSharedLinks(prev => prev.map(l => l.id === id ? { ...l, status: 'Revoked' } : l));
    addToast('Share link revoked.', 'info');
  };

  const addToast = (message, type = 'info', duration = 3500) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated, currentUser,
      profile, updateProfile,
      records, addRecord, deleteRecord,
      timeline,
      medications, addMedication, updateMedication, deleteMedication,
      appointments, addAppointment, updateAppointment, cancelAppointment,
      familyProfiles,
      sharedLinks, createShareLink, revokeShareLink,
      qrToken,
      toasts, addToast, removeToast,
      sidebarOpen, setSidebarOpen,
      login, demoLogin, logout, register,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
