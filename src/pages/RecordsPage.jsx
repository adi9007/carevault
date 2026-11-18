import { useState, useRef } from 'react';
import {
  FileText, Upload, Search, Filter, Trash2, Download,
  Eye, SortAsc, SortDesc, Plus, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppLayout } from '../components/Layout';
import {
  Card, Button, Input, Select, Badge, Modal, SectionHeader,
  EmptyState, DemoNotice, formatDate
} from '../components/ui';
import { RECORD_TYPES, RECORD_TYPE_COLORS } from '../data/mockData';

const FILE_TYPES = ['PDF', 'JPEG', 'PNG', 'DOCX'];

export default function RecordsPage() {
  const { records, addRecord, deleteRecord, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [sortOrder, setSortOrder] = useState('newest');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploadForm, setUploadForm] = useState({ title: '', type: 'Laboratory Report', provider: '', date: '', fileType: 'PDF', notes: '', file: null });
  const [uploadErrors, setUploadErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const filtered = records
    .filter(r => {
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.provider.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'All Types' || r.type === typeFilter;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      return sortOrder === 'newest'
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });

  const validateUpload = () => {
    const errs = {};
    if (!uploadForm.title.trim()) errs.title = 'Record title is required.';
    if (!uploadForm.provider.trim()) errs.provider = 'Provider name is required.';
    if (!uploadForm.date) errs.date = 'Date is required.';
    return errs;
  };

  const handleUpload = async () => {
    const errs = validateUpload();
    if (Object.keys(errs).length) { setUploadErrors(errs); return; }

    setUploading(true);
    await new Promise(r => setTimeout(r, 800));
    addRecord({ ...uploadForm });
    setUploading(false);
    setUploadOpen(false);
    setUploadForm({ title: '', type: 'Laboratory Report', provider: '', date: '', fileType: 'PDF', notes: '', file: null });
    setUploadErrors({});
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      addToast('Please upload a PDF, JPEG, PNG, or DOCX file.', 'error');
      return;
    }
    const ft = file.type === 'application/pdf' ? 'PDF'
      : file.type === 'image/jpeg' ? 'JPEG'
      : file.type === 'image/png' ? 'PNG'
      : 'DOCX';
    setUploadForm(f => ({ ...f, file, fileType: ft }));
    addToast(`File "${file.name}" selected.`, 'info');
  };

  const handleDelete = (rec) => {
    deleteRecord(rec.id);
    setDeleteConfirm(null);
  };

  const groupedCounts = {};
  RECORD_TYPES.slice(1).forEach(t => {
    groupedCounts[t] = records.filter(r => r.type === t).length;
  });

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Medical Records"
          description="All your health documents, organised in one place."
          action={
            <Button onClick={() => setUploadOpen(true)} variant="primary">
              <Upload className="w-4 h-4" /> Upload Record
            </Button>
          }
        />

        <DemoNotice message="All records shown are fictional demo data. Upload interactions are simulated — no files are transmitted or stored." />

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mt-5 mb-6">
          <button
            onClick={() => setTypeFilter('All Types')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${typeFilter === 'All Types' ? 'bg-[#163B65] text-white' : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F5F8FC]'}`}
          >
            All ({records.length})
          </button>
          {Object.entries(groupedCounts).filter(([, count]) => count > 0).map(([type, count]) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${typeFilter === type ? 'bg-[#163B65] text-white' : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F5F8FC]'}`}
            >
              {type} ({count})
            </button>
          ))}
        </div>

        {/* Search & filters */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="search"
                placeholder="Search by title or provider…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#2476C7]"
              />
            </div>
            <Select
              id="type-filter"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="sm:w-48"
            >
              {RECORD_TYPES.map(t => <option key={t}>{t}</option>)}
            </Select>
            <button
              onClick={() => setSortOrder(o => o === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E8F0] text-sm text-[#64748B] hover:bg-[#F5F8FC] transition-colors whitespace-nowrap"
            >
              {sortOrder === 'newest' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
              {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
            </button>
          </div>
        </Card>

        {/* Records list */}
        <Card padding={false}>
          {filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No records found"
              description={search || typeFilter !== 'All Types' ? 'Try adjusting your search or filters.' : 'Upload your first medical record to get started.'}
              action={
                <Button onClick={() => setUploadOpen(true)} variant="primary">
                  <Upload className="w-4 h-4" /> Upload Record
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F8FC] border-b border-[#E2E8F0]">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Record</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wide hidden sm:table-cell">Type</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wide hidden md:table-cell">Date</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wide hidden lg:table-cell">Provider</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wide hidden md:table-cell">Format</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filtered.map(rec => (
                    <tr key={rec.id} className="hover:bg-[#F5F8FC] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#F5F8FC] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-[#64748B]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#1F2937]">{rec.title}</p>
                            <p className="text-xs text-[#64748B] sm:hidden">{rec.type} · {formatDate(rec.date)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${RECORD_TYPE_COLORS[rec.type] || 'bg-gray-100 text-gray-700'}`}>
                          {rec.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#64748B] hidden md:table-cell">{formatDate(rec.date)}</td>
                      <td className="px-4 py-4 text-[#64748B] text-sm max-w-[200px] truncate hidden lg:table-cell">{rec.provider}</td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <Badge color="gray" size="xs">{rec.fileType}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => setViewRecord(rec)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-[#64748B] hover:text-[#2476C7]"
                            title="View record"
                            aria-label="View record"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => addToast('Sample document download simulated.', 'info')}
                            className="p-1.5 rounded-lg hover:bg-green-50 text-[#64748B] hover:text-green-600"
                            title="Download"
                            aria-label="Download record"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(rec)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600"
                            title="Delete"
                            aria-label="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Upload modal */}
        <Modal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Medical Record" size="md">
          <div className="space-y-5">
            <DemoNotice message="File uploads are simulated. No files are actually transmitted or stored." />
            <Input
              id="up-title"
              label="Record title *"
              placeholder="e.g. Blood Sugar Test"
              value={uploadForm.title}
              onChange={e => { setUploadForm(f => ({ ...f, title: e.target.value })); setUploadErrors(err => ({ ...err, title: '' })); }}
              error={uploadErrors.title}
            />
            <Select
              id="up-type"
              label="Record type"
              value={uploadForm.type}
              onChange={e => setUploadForm(f => ({ ...f, type: e.target.value }))}
            >
              {RECORD_TYPES.slice(1).map(t => <option key={t}>{t}</option>)}
            </Select>
            <Input
              id="up-provider"
              label="Healthcare provider *"
              placeholder="e.g. Dr. Meera Shah"
              value={uploadForm.provider}
              onChange={e => { setUploadForm(f => ({ ...f, provider: e.target.value })); setUploadErrors(err => ({ ...err, provider: '' })); }}
              error={uploadErrors.provider}
            />
            <Input
              id="up-date"
              label="Record date *"
              type="date"
              value={uploadForm.date}
              onChange={e => { setUploadForm(f => ({ ...f, date: e.target.value })); setUploadErrors(err => ({ ...err, date: '' })); }}
              error={uploadErrors.date}
            />
            <Input
              id="up-notes"
              label="Notes (optional)"
              placeholder="Any notes about this record…"
              value={uploadForm.notes}
              onChange={e => setUploadForm(f => ({ ...f, notes: e.target.value }))}
            />

            {/* File upload area */}
            <div>
              <label className="text-sm font-medium text-[#1F2937] mb-1.5 block">Document file (optional)</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-6 text-center cursor-pointer hover:border-[#2476C7] hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                {uploadForm.file ? (
                  <p className="text-sm font-medium text-[#2476C7]">{uploadForm.file.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-[#1F2937]">Click to select file</p>
                    <p className="text-xs text-[#64748B] mt-1">PDF, JPEG, PNG or DOCX</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" className="hidden" onChange={handleFileChange} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="md" className="flex-1" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button variant="primary" size="md" className="flex-1" onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading…' : 'Upload Record'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* View modal */}
        {viewRecord && (
          <Modal isOpen={!!viewRecord} onClose={() => setViewRecord(null)} title={viewRecord.title}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ViewField label="Type" value={<Badge color="blue">{viewRecord.type}</Badge>} />
                <ViewField label="Format" value={<Badge color="gray">{viewRecord.fileType}</Badge>} />
                <ViewField label="Date" value={formatDate(viewRecord.date)} />
                <ViewField label="Provider" value={viewRecord.provider} />
              </div>
              {viewRecord.notes && (
                <div className="p-4 bg-[#F5F8FC] rounded-xl">
                  <p className="text-xs font-semibold text-[#64748B] uppercase mb-2">Notes</p>
                  <p className="text-sm text-[#1F2937]">{viewRecord.notes}</p>
                </div>
              )}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-700">
                  This is a fictional demo record. No actual document is attached. Download is simulated.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => addToast('Sample download simulated.', 'info')}>
                  <Download className="w-4 h-4" /> Download
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => setViewRecord(null)}>Close</Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete confirm */}
        {deleteConfirm && (
          <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Record" size="sm">
            <p className="text-sm text-[#64748B] mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.title}</strong>? This action cannot be undone in the demo.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
            </div>
          </Modal>
        )}
      </div>
    </AppLayout>
  );
}

function ViewField({ label, value }) {
  return (
    <div>
      <p className="text-xs text-[#64748B] uppercase tracking-wide font-medium mb-1">{label}</p>
      <div className="text-sm text-[#1F2937]">{value}</div>
    </div>
  );
}
