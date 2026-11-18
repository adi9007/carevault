import { useState } from 'react';
import { Pill, Plus, Pencil, Trash2, X, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppLayout } from '../components/Layout';
import {
  Card, Button, Input, Select, Badge, Modal, SectionHeader,
  EmptyState, DemoNotice, formatDate
} from '../components/ui';

const FREQ_OPTIONS = ['Once daily', 'Twice daily', 'Three times daily', 'Once weekly', 'As needed', 'Other'];
const STATUS_OPTIONS = ['Active', 'Completed', 'Paused'];

const emptyForm = { name: '', dosage: '', frequency: 'Once daily', startDate: '', endDate: '', prescribedBy: '', status: 'Active', notes: '' };

export default function MedicationsPage() {
  const { medications, addMedication, updateMedication, deleteMedication } = useApp();
  const [tab, setTab] = useState('active');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const activeMeds = medications.filter(m => m.status === 'Active');
  const pastMeds = medications.filter(m => m.status !== 'Active');
  const displayed = tab === 'active' ? activeMeds : pastMeds;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Medicine name is required.';
    if (!form.dosage.trim()) errs.dosage = 'Dosage is required.';
    if (!form.startDate) errs.startDate = 'Start date is required.';
    if (!form.prescribedBy.trim()) errs.prescribedBy = 'Prescriber name is required.';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (editTarget) {
      updateMedication(editTarget.id, form);
    } else {
      addMedication(form);
    }
    closeModal();
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (med) => {
    setEditTarget(med);
    setForm({ ...med });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
  };

  const statusColor = {
    'Active': 'green',
    'Completed': 'gray',
    'Paused': 'yellow',
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Medication Manager"
          description="Track your current and past medications."
          action={
            <Button onClick={openAdd} variant="primary">
              <Plus className="w-4 h-4" /> Add Medication
            </Button>
          }
        />

        <DemoNotice message="All medication data is fictional. This tool displays sample entries only. No medical advice is provided." />

        {/* Tabs */}
        <div className="flex gap-1 mt-6 mb-6 bg-[#F5F8FC] rounded-xl p-1 w-fit border border-[#E2E8F0]">
          <button
            onClick={() => setTab('active')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'active' ? 'bg-white shadow-sm text-[#163B65]' : 'text-[#64748B] hover:text-[#163B65]'}`}
          >
            Active <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{activeMeds.length}</span>
          </button>
          <button
            onClick={() => setTab('past')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'past' ? 'bg-white shadow-sm text-[#163B65]' : 'text-[#64748B] hover:text-[#163B65]'}`}
          >
            Past / Completed <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{pastMeds.length}</span>
          </button>
        </div>

        {displayed.length === 0 ? (
          <EmptyState
            icon={Pill}
            title={tab === 'active' ? 'No active medications' : 'No past medications'}
            description={tab === 'active' ? 'Add your current medications to track them.' : 'Completed medications will appear here.'}
            action={tab === 'active' ? <Button onClick={openAdd} variant="primary"><Plus className="w-4 h-4" /> Add Medication</Button> : null}
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {displayed.map(med => (
              <Card key={med.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${med.status === 'Active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Pill className={`w-5 h-5 ${med.status === 'Active' ? 'text-green-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#163B65]">{med.name}</p>
                      <p className="text-sm text-[#64748B]">{med.dosage}</p>
                    </div>
                  </div>
                  <Badge color={statusColor[med.status] || 'gray'}>{med.status}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <MedRow label="Frequency" value={med.frequency} />
                  <MedRow label="Start date" value={formatDate(med.startDate)} />
                  {med.endDate && <MedRow label="End date" value={formatDate(med.endDate)} />}
                  <MedRow label="Prescribed by" value={med.prescribedBy} />
                </div>

                {med.notes && (
                  <p className="text-xs text-[#64748B] mt-3 p-2 bg-[#F5F8FC] rounded-lg italic">{med.notes}</p>
                )}

                <div className="flex gap-2 mt-4 pt-4 border-t border-[#E2E8F0]">
                  <Button variant="outline" size="xs" className="flex-1" onClick={() => openEdit(med)}>
                    <Pencil className="w-3 h-3" /> Edit
                  </Button>
                  <Button variant="outline-danger" size="xs" className="flex-1" onClick={() => setDeleteTarget(med)}>
                    <Trash2 className="w-3 h-3" /> Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit modal */}
        <Modal isOpen={modalOpen} onClose={closeModal} title={editTarget ? 'Edit Medication' : 'Add Medication'}>
          <div className="space-y-4">
            <Input
              id="med-name"
              label="Medicine name *"
              placeholder="e.g. Vitamin D3"
              value={form.name}
              onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(err => ({ ...err, name: '' })); }}
              error={errors.name}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="med-dosage"
                label="Dosage *"
                placeholder="e.g. 500 mg"
                value={form.dosage}
                onChange={e => { setForm(f => ({ ...f, dosage: e.target.value })); setErrors(err => ({ ...err, dosage: '' })); }}
                error={errors.dosage}
              />
              <Select
                id="med-freq"
                label="Frequency"
                value={form.frequency}
                onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
              >
                {FREQ_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="med-start"
                label="Start date *"
                type="date"
                value={form.startDate}
                onChange={e => { setForm(f => ({ ...f, startDate: e.target.value })); setErrors(err => ({ ...err, startDate: '' })); }}
                error={errors.startDate}
              />
              <Input
                id="med-end"
                label="End date (if applicable)"
                type="date"
                value={form.endDate || ''}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
              />
            </div>
            <Input
              id="med-prescriber"
              label="Prescribed by *"
              placeholder="e.g. Dr. Meera Shah"
              value={form.prescribedBy}
              onChange={e => { setForm(f => ({ ...f, prescribedBy: e.target.value })); setErrors(err => ({ ...err, prescribedBy: '' })); }}
              error={errors.prescribedBy}
            />
            <Select
              id="med-status"
              label="Status"
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            >
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </Select>
            <Input
              id="med-notes"
              label="Notes (optional)"
              placeholder="Any notes about this medication…"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button>
              <Button variant="primary" className="flex-1" onClick={handleSave}>
                {editTarget ? 'Save Changes' : 'Add Medication'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete confirm */}
        {deleteTarget && (
          <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Medication" size="sm">
            <p className="text-sm text-[#64748B] mb-6">
              Remove <strong>{deleteTarget.name}</strong> from your medication list?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={() => { deleteMedication(deleteTarget.id); setDeleteTarget(null); }}>Remove</Button>
            </div>
          </Modal>
        )}
      </div>
    </AppLayout>
  );
}

function MedRow({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-[#64748B] text-xs">{label}</span>
      <span className="text-[#1F2937] font-medium text-xs text-right">{value}</span>
    </div>
  );
}
