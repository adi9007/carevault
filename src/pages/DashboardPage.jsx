import { Link } from 'react-router-dom';
import {
  FileText, Pill, Calendar, Activity, QrCode, ChevronRight,
  AlertCircle, Clock, User, TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppLayout } from '../components/Layout';
import { Card, Badge, Button, formatDate, formatTime } from '../components/ui';
import { RECORD_TYPE_COLORS, TIMELINE_CATEGORY_COLORS } from '../data/mockData';

export default function DashboardPage() {
  const { profile, records, medications, appointments, timeline } = useApp();

  const upcoming = appointments.filter(a => a.status === 'Upcoming').sort((a, b) => new Date(a.date) - new Date(b.date));
  const activeMeds = medications.filter(m => m.status === 'Active');
  const recentRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  const recentTimeline = [...timeline].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  const stats = [
    { label: 'Medical Records', value: records.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', to: '/records' },
    { label: 'Active Medications', value: activeMeds.length, icon: Pill, color: 'text-teal-600', bg: 'bg-teal-50', to: '/medications' },
    { label: 'Upcoming Appointments', value: upcoming.length, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', to: '/appointments' },
    { label: 'Health Events', value: timeline.length, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50', to: '/timeline' },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-sm text-[#64748B]">Here's an overview of your health information.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <Link key={s.label} to={s.to} className="group">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2476C7] transition-colors" />
                  </div>
                  <p className="text-3xl font-bold text-[#163B65] mb-1">{s.value}</p>
                  <p className="text-sm text-[#64748B]">{s.label}</p>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Profile Card */}
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-[#163B65]">Health Profile</h2>
                <Link to="/profile">
                  <Button variant="outline" size="sm">View Profile</Button>
                </Link>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-full bg-[#163B65] flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">
                    {profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-bold text-[#163B65]">{profile.name}</p>
                  <p className="text-sm text-[#64748B] mt-0.5">
                    Born {formatDate(profile.dob)} · {profile.gender}
                  </p>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6">
                    <ProfileField label="Blood Group" value={<Badge color="red">{profile.bloodGroup}</Badge>} />
                    <ProfileField label="Height" value={profile.height} />
                    <ProfileField label="Weight" value={profile.weight} />
                    <ProfileField label="Allergies" value={
                      profile.allergies?.length
                        ? profile.allergies.map(a => <Badge key={a} color="orange" size="xs">{a}</Badge>)
                        : <span className="text-xs text-[#64748B]">None recorded</span>
                    } />
                    <ProfileField label="Chronic Conditions" value={
                      profile.chronicConditions?.length
                        ? profile.chronicConditions.join(', ')
                        : <span className="text-xs text-[#64748B]">None recorded</span>
                    } />
                    <ProfileField label="Emergency Contact" value={
                      <span className="text-xs">{profile.emergencyContact?.name} ({profile.emergencyContact?.relationship})</span>
                    } />
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Records */}
            <Card padding={false}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
                <h2 className="text-lg font-semibold text-[#163B65]">Recent Medical Records</h2>
                <Link to="/records">
                  <Button variant="ghost" size="sm">View all</Button>
                </Link>
              </div>
              <div className="divide-y divide-[#E2E8F0]">
                {recentRecords.map(rec => (
                  <div key={rec.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#F5F8FC] transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-[#F5F8FC] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-[#64748B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1F2937] truncate">{rec.title}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{rec.provider}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${RECORD_TYPE_COLORS[rec.type] || 'bg-gray-100 text-gray-700'}`}>
                        {rec.type}
                      </span>
                      <span className="text-xs text-[#64748B]">{formatDate(rec.date)}</span>
                    </div>
                    <Link to="/records" className="ml-2">
                      <Button variant="ghost" size="xs">View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Upcoming appointment */}
            <Card>
              <h2 className="text-lg font-semibold text-[#163B65] mb-5">Upcoming Appointment</h2>
              {upcoming.length > 0 ? (
                <>
                  {upcoming.slice(0, 1).map(a => (
                    <div key={a.id} className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="w-10 h-10 rounded-xl bg-[#2476C7] flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#163B65]">{a.doctor}</p>
                          <p className="text-xs text-[#64748B]">{a.specialty}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="w-3 h-3 text-[#64748B]" />
                            <span className="text-xs text-[#64748B]">{formatDate(a.date)} at {formatTime(a.time)}</span>
                          </div>
                          <Badge color="blue" size="xs" className="mt-2">{a.status}</Badge>
                        </div>
                      </div>
                      <Link to="/appointments" className="block">
                        <Button variant="outline" size="sm" className="w-full">View Appointment</Button>
                      </Link>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="w-10 h-10 text-[#E2E8F0] mx-auto mb-3" />
                  <p className="text-sm text-[#64748B]">No upcoming appointments.</p>
                  <Link to="/appointments" className="block mt-3">
                    <Button variant="outline" size="sm">Schedule Appointment</Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Health Timeline preview */}
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-[#163B65]">Recent Activity</h2>
                <Link to="/timeline">
                  <Button variant="ghost" size="sm">Full timeline</Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentTimeline.map((event, i) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${TIMELINE_CATEGORY_COLORS[event.category] || 'bg-gray-400'}`} />
                      {i < recentTimeline.length - 1 && <div className="w-0.5 bg-[#E2E8F0] flex-1 mt-1 min-h-4" />}
                    </div>
                    <div className="pb-3 flex-1 min-w-0">
                      <p className="text-xs text-[#64748B]">{formatDate(event.date)}</p>
                      <p className="text-sm font-medium text-[#1F2937] mt-0.5">{event.title}</p>
                      <p className="text-xs text-[#64748B] mt-0.5 truncate">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Emergency QR card */}
            <Card className="bg-gradient-to-br from-[#163B65] to-[#1a4a7a] text-white border-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Emergency QR</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-blue-200">Demo QR Active</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-blue-200 mb-5">
                Keep essential health information accessible in an emergency.
              </p>
              <Link to="/emergency">
                <Button variant="outline" size="sm" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                  View Emergency QR
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-xs text-[#64748B] mb-1">{label}</p>
      <div className="flex flex-wrap gap-1 items-center">
        {typeof value === 'string' || typeof value === 'number'
          ? <span className="text-sm font-medium text-[#1F2937]">{value}</span>
          : value}
      </div>
    </div>
  );
}
