import { useParams, Link } from 'react-router-dom';
import {
  Shield, Droplets, Pill, Activity, Phone, AlertTriangle, QrCode, ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui';

export default function EmergencyViewPage() {
  const { token } = useParams();
  const { profile, medications } = useApp();

  const activeMeds = medications.filter(m => m.status === 'Active');

  return (
    <div className="min-h-screen bg-[#F5F8FC] py-8 px-4">
      {/* Emergency header */}
      <div className="max-w-lg mx-auto">
        {/* Alert banner */}
        <div className="bg-red-600 text-white rounded-2xl p-5 mb-6 text-center shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">EMERGENCY HEALTH PROFILE</span>
          </div>
          <p className="text-red-100 text-sm">For emergency responder use only</p>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
          <span>
            <strong>Demo notice:</strong> This emergency profile uses entirely fictional information and is not intended for real emergency care.
          </span>
        </div>

        {/* Patient identifier */}
        <div className="bg-white rounded-2xl border-2 border-[#163B65] p-6 mb-5 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-[#163B65] flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white">
                {profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="text-xl font-bold text-[#163B65]">{profile.name}</p>
              <p className="text-sm text-[#64748B]">Demo patient — fictional data</p>
            </div>
          </div>
        </div>

        {/* Critical fields */}
        <div className="space-y-4">
          {/* Blood group */}
          <div className="bg-white rounded-2xl border-2 border-red-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-sm font-bold text-[#64748B] uppercase tracking-wide">Blood Group</span>
            </div>
            <p className="text-4xl font-black text-red-600">{profile.bloodGroup}</p>
          </div>

          {/* Allergies */}
          <div className="bg-white rounded-2xl border-2 border-orange-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-sm font-bold text-[#64748B] uppercase tracking-wide">Known Allergies</span>
            </div>
            {profile.allergies?.length ? (
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map(a => (
                  <span key={a} className="px-4 py-2 bg-orange-100 text-orange-800 font-bold text-lg rounded-xl">
                    ⚠ {a}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-lg text-[#64748B]">None recorded</p>
            )}
          </div>

          {/* Medications */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <Pill className="w-5 h-5 text-teal-500" />
              </div>
              <span className="text-sm font-bold text-[#64748B] uppercase tracking-wide">Current Medications</span>
            </div>
            {activeMeds.length ? (
              <div className="space-y-2">
                {activeMeds.map(m => (
                  <div key={m.id} className="p-3 bg-teal-50 rounded-xl">
                    <p className="font-semibold text-[#163B65]">{m.name}</p>
                    <p className="text-sm text-[#64748B]">{m.dosage} · {m.frequency}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#64748B]">None recorded</p>
            )}
          </div>

          {/* Chronic conditions */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-sm font-bold text-[#64748B] uppercase tracking-wide">Chronic Conditions</span>
            </div>
            <p className="text-[#1F2937] font-medium">
              {profile.chronicConditions?.length ? profile.chronicConditions.join(', ') : 'None recorded'}
            </p>
          </div>

          {/* Emergency contact */}
          <div className="bg-white rounded-2xl border-2 border-green-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-bold text-[#64748B] uppercase tracking-wide">Emergency Contact</span>
            </div>
            <p className="text-xl font-bold text-[#163B65]">{profile.emergencyContact?.name}</p>
            <p className="text-[#64748B]">{profile.emergencyContact?.relationship}</p>
            <p className="text-lg font-bold text-green-700 mt-2">{profile.emergencyContact?.phone}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 p-4 bg-white rounded-xl border border-[#E2E8F0] text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <QrCode className="w-4 h-4 text-[#163B65]" />
            <span className="text-sm font-semibold text-[#163B65]">CareVault Emergency Profile</span>
          </div>
          <p className="text-xs text-[#64748B] mb-1">Token: {token}</p>
          <p className="text-xs text-[#94A3B8]">This view shows only pre-approved emergency fields. Full medical records are not accessible here.</p>
          <Link to="/emergency" className="inline-flex items-center gap-1.5 mt-4 text-sm text-[#2476C7] font-medium hover:text-[#1d63a8]">
            <ArrowLeft className="w-3 h-3" /> Back to Emergency QR Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
