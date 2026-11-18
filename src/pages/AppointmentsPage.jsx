import { useState } from 'react';
import { Calendar, Plus, Pencil, X, Clock, MapPin, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppLayout } from '../components/Layout';
import {
  Card, Button, Input, Select, Badge, Modal, SectionHeader,
  EmptyState, DemoNotice, formatDate, formatTime
} from '../components/ui';

const STATUS_COLORS = {
  'Upcoming': 'blue',
  'Completed': 'gray',
  'Cancelled': 'red',
};

const APPT_TYPES = ['Routine Check-up', 'Follow-up', 'Consultation', 'Hospitalisation', 'Emergency', 'Procedure'];
const emptyForm = { doctor: '', specialty: '', date: '', time: '', type: 'Routine Check-up', location: '', notes: '' };

export default function AppointmentsPage() {
  const { appointments, addAppointment, updateAppointment, cancelAppointment } = useApp();
  const [tab, setTab] = useState('upcoming');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const upcoming = appointments.filter(a => a.status === 'Upcoming').sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = appointments.filter(a => a.status !== 'Upcoming').sort((a, b) => new Date(b.date) - new Date(a.date));
  const displayed = tab === 'upcoming' ? upcoming : past;

  const validate = () => {
    const errs = {};
    if (!form.doctor.trim()) errs.doctor = 'Doctor name is required.';
    if (!form.date) errs.date = 'Date is required.';
    if (!form.time) errs.time = 'Time is required.';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (editTarget) {
      updateAppointment(editTarget.id, form);
    } else {
      addAppointment(form);
    }
    closeModal();
  };

  const openAdd = () => { setEditTarget(null); setForm(emptyForm); setErrors({}); setModalOpen(true); };
  const openEdit = (a) => { setEditTarget(a); setForm({ doctor: a.doctor, specialty: a.specialty || '', date: a.date, time: a.time, type: a.type, location: a.location || '', notes: a.notes || '' }); setErrors({}); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTarget(null); setForm(emptyForm); setErrors({}); };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Appointments"
          description="Manage your medical appointments."
          action={<Button onClick={openAdd} variant="primary"><Plus className="w-4 h-4" /> Add Appointment</Button>}
        />

        <DemoNotice message="All appointments are fictional demo entries. No bookings are made with real healthcare providers." />

        {/* Tabs */}
        <div className="flex gap-1 mt-6 mb-6 bg-[#F5F8FC] rounded-xl p-1 w-fit border border-[#E2E8F0]">
          <button
            onClick={() => setTab('upcoming')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'upcoming' ? 'bg-white shadow-sm text-[#163B65]' : 'text-[#64748B] hover:text-[#163B65]'}`}
          >
            Upcoming <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{upcoming.length}</span>
          </button>
          <button
            onClick={() => setTab('past')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'past' ? 'bg-white shadow-sm text-[#163B65]' : 'text-[#64748B] hover:text-[#163B65]'}`}
          >
            Past <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{past.length}</span>
          </button>
        </div>

        {displayed.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={tab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}
            description={tab === 'upcoming' ? 'Add a demo appointment to see it here.' : 'Past appointments will appear here.'}
            action={tab === 'upcoming' ? <Button onClick={openAdd} variant="primary"><Plus className="w-4 h-4" /> Add Appointment</Button> : null}
          />
        ) : (
          <div className="space-y-4">
            {displayed.map(appt => (
              <Card key={appt.id} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${appt.status === 'Upcoming' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Calendar className={`w-6 h-6 ${appt.status === 'Upcoming' ? 'text-blue-600' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-semibold text-[#163B65]">{appt.doctor}</p>
                        <Badge color={STATUS_COLORS[appt.status] || 'gray'}>{appt.status}</Badge>
                      </div>
                      {appt.specialty && <p className="text-sm text-[#64748B]">{appt.specialty}</p>}

                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(appt.date)} at {formatTime(appt.time)}
                        </div>
                        {appt.location && (
                          <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
                            <MapPin className="w-3.5 h-3.5" />
                            {appt.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
                          <FileText className="w-3.5 h-3.5" />
                          {appt.type}
                        </div>
                      </div>

                      {appt.notes && (
                        <p className="text-sm text-[#64748B] mt-2 p-2 bg-[#F5F8FC] rounded-lg">{appt.notes}</p>
                      )}
                    </div>
                  </div>

                  {appt.status === 'Upcoming' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="xs" onClick={() => openEdit(appt)}>
                        <Pencil className="w-3 h-3" /> Edit
                      </Button>
                      <Button variant="outline-danger" size="xs" onClick={() => setCancelTarget(appt)}>
                        <X className="w-3 h-3" /> Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit modal */}
        <Modal isOpen={modalOpen} onClose={closeModal} title={editTarget ? 'Edit Appointment' : 'Add Demo Appointment'}>
          <div className="space-y-4">
            <DemoNotice message="This appointment is a demo entry and is not booked with any real provider." />
            <Input
              id="appt-doctor"
              label="Doctor / Provider *"
              placeholder="e.g. Dr. Meera Shah"
              value={form.doctor}
              onChange={e => { setForm(f => ({ ...f, doctor: e.target.value })); setErrors(err => ({ ...err, doctor: '' })); }}
              error={errors.doctor}
            />
            <Input
              id="appt-specialty"
              label="Specialty"
              placeholder="e.g. General Medicine"
              value={form.specialty}
              onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="appt-date"
                label="Date *"
                type="date"
                value={form.date}
                onChange={e => { setForm(f => ({ ...f, date: e.target.value })); setErrors(err => ({ ...err, date: '' })); }}
                error={errors.date}
              />
              <Input
                id="appt-time"
                label="Time *"
                type="time"
                value={form.time}
                onChange={e => { setForm(f => ({ ...f, time: e.target.value })); setErrors(err => ({ ...err, time: '' })); }}
                error={errors.time}
              />
            </div>
            <Select
              id="appt-type"
              label="Appointment type"
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            >
              {APPT_TYPES.map(t => <option key={t}>{t}</option>)}
            </Select>
            <Input
              id="appt-location"
              label="Location"
              placeholder="Clinic or hospital name"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            />
            <Input
              id="appt-notes"
              label="Notes"
              placeholder="Reason or preparation notes…"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button>
              <Button variant="primary" className="flex-1" onClick={handleSave}>
                {editTarget ? 'Save Changes' : 'Add Appointment'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Cancel confirm */}
        {cancelTarget && (
          <Modal isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel Appointment" size="sm">
            <p className="text-sm text-[#64748B] mb-6">
              Cancel the appointment with <strong>{cancelTarget.doctor}</strong> on {formatDate(cancelTarget.date)}?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setCancelTarget(null)}>Keep</Button>
              <Button variant="danger" className="flex-1" onClick={() => { cancelAppointment(cancelTarget.id); setCancelTarget(null); }}>Cancel Appointment</Button>
            </div>
          </Modal>
        )}
      </div>
    </AppLayout>
  );
}
