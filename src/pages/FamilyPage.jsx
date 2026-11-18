import { useState } from 'react';
import { Users, FileText, ChevronRight, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppLayout } from '../components/Layout';
import { Card, Badge, Button, SectionHeader, DemoNotice, formatDate, getAge } from '../components/ui';
import { RECORD_TYPE_COLORS } from '../data/mockData';

const RELATIONSHIP_COLORS = {
  'Self': 'blue',
  'Mother': 'purple',
  'Father': 'purple',
  'Grandfather': 'gray',
  'Grandmother': 'gray',
  'Younger Brother': 'green',
  'Younger Sister': 'green',
};

export default function FamilyPage() {
  const { familyProfiles, records } = useApp();
  const [selectedProfileId, setSelectedProfileId] = useState('fp-self');

  const selected = familyProfiles.find(p => p.id === selectedProfileId);
  const displayedRecords = selected?.isSelf ? records : (selected?.records || []);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="Family Profiles"
          description="View and manage health records for family members."
        />

        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
          <span>
            <strong>Demo notice:</strong> Family profiles are fictional. In a real system, adding dependents
            requires appropriate authorisation and consent, especially for minors or adults who cannot independently manage their records.
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile selector */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-3">Family Members</h2>
            {familyProfiles.map(fp => (
              <button
                key={fp.id}
                onClick={() => setSelectedProfileId(fp.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                  selectedProfileId === fp.id
                    ? 'border-[#2476C7] bg-blue-50 shadow-sm'
                    : 'border-[#E2E8F0] bg-white hover:bg-[#F5F8FC]'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-lg ${
                  fp.isSelf ? 'bg-[#163B65]' : 'bg-[#2476C7]'
                }`}>
                  {fp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#163B65] truncate">{fp.name}</p>
                  <p className="text-xs text-[#64748B]">{fp.relationship}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#94A3B8]">{fp.recordCount} records</span>
                    {fp.bloodGroup && <Badge color="red" size="xs">{fp.bloodGroup}</Badge>}
                  </div>
                </div>
                {selectedProfileId === fp.id && <ChevronRight className="w-4 h-4 text-[#2476C7]" />}
              </button>
            ))}

            <button className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-[#E2E8F0] text-sm text-[#64748B] hover:border-[#2476C7] hover:text-[#2476C7] transition-colors">
              <Users className="w-4 h-4" /> Add Family Member
            </button>
          </div>

          {/* Profile detail */}
          <div className="lg:col-span-2">
            {selected && (
              <div className="space-y-5">
                {/* Header */}
                <Card>
                  <div className="flex items-center gap-5">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-2xl ${
                      selected.isSelf ? 'bg-[#163B65]' : 'bg-[#2476C7]'
                    }`}>
                      {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#163B65]">{selected.name}</h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge color={RELATIONSHIP_COLORS[selected.relationship] || 'gray'}>
                          {selected.relationship}
                        </Badge>
                        {selected.bloodGroup && <Badge color="red">{selected.bloodGroup}</Badge>}
                        {selected.isSelf && <Badge color="blue">Primary Account</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-[#64748B]">
                        {selected.dob && <span>Age {getAge(selected.dob)} · Born {formatDate(selected.dob)}</span>}
                        <span>{displayedRecords.length} record{displayedRecords.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Records */}
                <Card padding={false}>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
                    <h3 className="text-base font-semibold text-[#163B65]">Health Records</h3>
                    {selected.isSelf && (
                      <Badge color="blue" size="sm">Showing your records</Badge>
                    )}
                  </div>
                  {displayedRecords.length === 0 ? (
                    <div className="py-10 text-center">
                      <FileText className="w-10 h-10 text-[#E2E8F0] mx-auto mb-3" />
                      <p className="text-sm text-[#64748B]">No records for this profile.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E2E8F0]">
                      {displayedRecords.map(rec => (
                        <div key={rec.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#F5F8FC] transition-colors">
                          <div className="w-9 h-9 rounded-lg bg-[#F5F8FC] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-[#64748B]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#1F2937] truncate">{rec.title}</p>
                            {rec.provider && <p className="text-xs text-[#64748B] mt-0.5">{rec.provider}</p>}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${RECORD_TYPE_COLORS[rec.type] || 'bg-gray-100 text-gray-700'}`}>
                              {rec.type}
                            </span>
                            <span className="text-xs text-[#64748B]">{formatDate(rec.date)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {!selected.isSelf && (
                  <div className="p-4 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-xs text-[#64748B]">
                    <p className="font-medium text-[#163B65] mb-1">Note on dependent access</p>
                    <p>
                      This is a simulated family profile. In production, managing records for other individuals —
                      especially minors or vulnerable adults — requires explicit authorisation, consent documentation,
                      and compliance with applicable regulations.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
