import { useState } from 'react';
import {
  Share2, CheckSquare, Square, Clock, Shield, Copy, Trash2,
  ChevronRight, Info, AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppLayout } from '../components/Layout';
import {
  Card, Button, Select, Badge, SectionHeader, DemoNotice,
  Modal, formatDate
} from '../components/ui';
import { RECORD_TYPE_COLORS } from '../data/mockData';

const EXPIRY_OPTIONS = [
  { value: '1h', label: '1 hour' },
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
];

const STEPS = ['Select Records', 'Configure Access', 'Review & Create'];

export default function SharePage() {
  const { records, sharedLinks, createShareLink, revokeShareLink, addToast } = useApp();
  const [step, setStep] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [expiry, setExpiry] = useState('24h');
  const [permission] = useState('Read-only');
  const [createdLink, setCreatedLink] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);

  const toggleRecord = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => setSelectedIds(records.map(r => r.id));
  const clearAll = () => setSelectedIds([]);

  const handleCreate = () => {
    if (selectedIds.length === 0) { addToast('Please select at least one record.', 'error'); return; }
    const link = createShareLink(selectedIds, expiry, permission);
    setCreatedLink(link);
    setStep(3);
  };

  const handleCopyLink = (token) => {
    const url = `${window.location.origin}/share/view/${token}`;
    navigator.clipboard.writeText(url).then(() => addToast('Share link copied to clipboard.', 'success'));
  };

  const handleRevoke = (link) => {
    revokeShareLink(link.id);
    setRevokeTarget(null);
  };

  const reset = () => { setStep(0); setSelectedIds([]); setExpiry('24h'); setCreatedLink(null); };

  const selectedRecords = records.filter(r => selectedIds.includes(r.id));

  const isExpired = (link) => {
    return link.status === 'Revoked' || new Date(link.expiresAt) < new Date();
  };

  const getLinkStatus = (link) => {
    if (link.status === 'Revoked') return 'Revoked';
    if (new Date(link.expiresAt) < new Date()) return 'Expired';
    return 'Active';
  };

  const getStatusColor = (status) => {
    if (status === 'Active') return 'green';
    if (status === 'Revoked') return 'red';
    return 'gray';
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="Share Medical Records"
          description="Choose what to share and control how long access remains available."
        />

        <DemoNotice message="Sharing links are simulated. No real data is transmitted. In production, access control and expiry enforcement must be implemented server-side." />

        {/* Stepper */}
        {step < 3 && (
          <div className="flex items-center gap-2 mt-6 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 flex-1 ${i < step ? 'text-[#16845B]' : i === step ? 'text-[#163B65]' : 'text-[#94A3B8]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    i < step ? 'bg-green-100 text-green-600' : i === step ? 'bg-[#163B65] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-green-300' : 'bg-[#E2E8F0]'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 0: Select Records */}
        {step === 0 && (
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-[#163B65]">Select records to share</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="xs" onClick={selectAll}>Select all</Button>
                <Button variant="ghost" size="xs" onClick={clearAll}>Clear</Button>
              </div>
            </div>
            <p className="text-sm text-[#64748B] mb-4">{selectedIds.length} of {records.length} records selected</p>
            <div className="space-y-2">
              {records.map(rec => {
                const selected = selectedIds.includes(rec.id);
                return (
                  <button
                    key={rec.id}
                    onClick={() => toggleRecord(rec.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      selected ? 'border-[#2476C7] bg-blue-50' : 'border-[#E2E8F0] hover:bg-[#F5F8FC]'
                    }`}
                  >
                    {selected
                      ? <CheckSquare className="w-5 h-5 text-[#2476C7] flex-shrink-0" />
                      : <Square className="w-5 h-5 text-[#94A3B8] flex-shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1F2937] truncate">{rec.title}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{rec.provider} · {formatDate(rec.date)}</p>
                    </div>
                    <span className={`hidden sm:inline-flex px-2 py-1 rounded-full text-xs font-medium ${RECORD_TYPE_COLORS[rec.type] || 'bg-gray-100 text-gray-700'}`}>
                      {rec.type}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end mt-6">
              <Button
                variant="primary"
                onClick={() => { if (selectedIds.length === 0) { addToast('Select at least one record.', 'error'); return; } setStep(1); }}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 1: Configure */}
        {step === 1 && (
          <Card>
            <h2 className="text-base font-semibold text-[#163B65] mb-5">Configure access</h2>
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-[#1F2937] mb-2">Access type</p>
                <div className="p-4 bg-[#F5F8FC] rounded-xl border border-[#E2E8F0] flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#2476C7]" />
                  <div>
                    <p className="text-sm font-semibold text-[#163B65]">Read-only</p>
                    <p className="text-xs text-[#64748B]">Recipient can view selected records but cannot edit or delete them.</p>
                  </div>
                </div>
              </div>

              <Select
                id="expiry"
                label="Link expiry"
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
              >
                {EXPIRY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800">
                  This is a simulated demo link. In production, expiry enforcement and access revocation would be handled server-side.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-[#64748B] mb-2">Selected records ({selectedRecords.length})</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedRecords.map(r => (
                    <div key={r.id} className="text-xs text-[#64748B] flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2476C7]" />
                      {r.title} — {formatDate(r.date)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button variant="primary" onClick={() => setStep(2)}>
                Review <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <Card>
            <h2 className="text-base font-semibold text-[#163B65] mb-5">Review and create</h2>
            <div className="space-y-4">
              <ReviewRow label="Records selected" value={`${selectedIds.length} record${selectedIds.length !== 1 ? 's' : ''}`} />
              <ReviewRow label="Access type" value="Read-only" />
              <ReviewRow label="Link expiry" value={EXPIRY_OPTIONS.find(o => o.value === expiry)?.label} />
              <ReviewRow label="Created" value="Now" />

              <div className="p-4 bg-[#F5F8FC] rounded-xl border border-[#E2E8F0]">
                <p className="text-xs font-semibold text-[#64748B] uppercase mb-2">Selected records</p>
                {selectedRecords.map(r => (
                  <div key={r.id} className="text-sm text-[#1F2937] flex items-center gap-2 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2476C7] flex-shrink-0" />
                    {r.title}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button variant="teal" onClick={handleCreate}>
                <Share2 className="w-4 h-4" /> Create Demo Link
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Success */}
        {step === 3 && createdLink && (
          <Card className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-[#163B65] mb-2">Demo share link created</h2>
            <p className="text-sm text-[#64748B] mb-6">
              {createdLink.recordIds.length} record{createdLink.recordIds.length !== 1 ? 's' : ''} ·{' '}
              {permission} · Expires in {EXPIRY_OPTIONS.find(o => o.value === createdLink.expiry)?.label}
            </p>

            <div className="flex items-center gap-2 p-3 bg-[#F5F8FC] rounded-xl border border-[#E2E8F0] mb-6">
              <code className="text-xs text-[#64748B] flex-1 truncate text-left">
                {window.location.origin}/share/view/{createdLink.token}
              </code>
              <button
                onClick={() => handleCopyLink(createdLink.token)}
                className="p-1.5 rounded-lg hover:bg-[#E2E8F0] text-[#64748B]"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <Button variant="outline" onClick={reset} className="w-full">Create Another Link</Button>
          </Card>
        )}

        {/* Active shares */}
        {sharedLinks.length > 0 && (
          <div className="mt-8">
            <h2 className="text-base font-semibold text-[#163B65] mb-4">Managed Shares</h2>
            <div className="space-y-3">
              {sharedLinks.map(link => {
                const linkStatus = getLinkStatus(link);
                const expired = isExpired(link);
                return (
                  <Card key={link.id} padding={false}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${expired ? 'bg-gray-100' : 'bg-green-100'}`}>
                          <Share2 className={`w-4 h-4 ${expired ? 'text-gray-400' : 'text-green-600'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-[#1F2937]">
                              {link.recordIds.length} record{link.recordIds.length !== 1 ? 's' : ''}
                            </p>
                            <Badge color={getStatusColor(linkStatus)} size="xs">{linkStatus}</Badge>
                          </div>
                          <p className="text-xs text-[#64748B] mt-0.5">
                            Created {formatDate(link.createdAt)} ·{' '}
                            {linkStatus === 'Active' ? `Expires ${formatDate(link.expiresAt)}` : `Expired ${formatDate(link.expiresAt)}`}
                          </p>
                          <p className="text-xs text-[#64748B]">{link.permission}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!expired && (
                          <Button variant="ghost" size="xs" onClick={() => handleCopyLink(link.token)}>
                            <Copy className="w-3 h-3" /> Copy
                          </Button>
                        )}
                        {linkStatus === 'Active' && (
                          <Button variant="outline-danger" size="xs" onClick={() => setRevokeTarget(link)}>
                            <Trash2 className="w-3 h-3" /> Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Revoke confirm */}
        {revokeTarget && (
          <Modal isOpen={!!revokeTarget} onClose={() => setRevokeTarget(null)} title="Revoke Share Link" size="sm">
            <p className="text-sm text-[#64748B] mb-6">
              This will immediately revoke access to the shared records. Anyone with the link will no longer be able to view them.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setRevokeTarget(null)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={() => handleRevoke(revokeTarget)}>Revoke Access</Button>
            </div>
          </Modal>
        )}
      </div>
    </AppLayout>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0] last:border-0">
      <span className="text-sm text-[#64748B]">{label}</span>
      <span className="text-sm font-semibold text-[#163B65]">{value}</span>
    </div>
  );
}
