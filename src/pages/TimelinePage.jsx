import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FlaskConical, Stethoscope, Pill, Syringe, Scan, Building2, FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppLayout } from '../components/Layout';
import { Card, Badge, Button, SectionHeader, formatDate } from '../components/ui';
import { TIMELINE_CATEGORY_COLORS } from '../data/mockData';

const CATEGORIES = ['All', 'Consultation', 'Laboratory Test', 'Prescription', 'Vaccination', 'Imaging', 'Hospitalisation'];

const CATEGORY_ICONS = {
  'Laboratory Test': FlaskConical,
  'Consultation': Stethoscope,
  'Prescription': Pill,
  'Vaccination': Syringe,
  'Imaging': Scan,
  'Hospitalisation': Building2,
  'Other': FileText,
};

const BADGE_COLORS = {
  'Laboratory Test': 'blue',
  'Consultation': 'purple',
  'Prescription': 'teal',
  'Vaccination': 'green',
  'Imaging': 'orange',
  'Hospitalisation': 'red',
  'Other': 'gray',
};

export default function TimelinePage() {
  const { timeline, records } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = [...timeline]
    .filter(e => activeFilter === 'All' || e.category === activeFilter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const getLinkedRecord = (id) => records.find(r => r.id === id);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          title="Health Timeline"
          description="Your medical history in chronological order."
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === cat
                  ? 'bg-[#163B65] text-white shadow-sm'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F5F8FC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-[#64748B]">No events found for this category.</p>
          </Card>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-[#E2E8F0] z-0" />

            <div className="space-y-6">
              {filtered.map((event, i) => {
                const Icon = CATEGORY_ICONS[event.category] || FileText;
                const dotColor = TIMELINE_CATEGORY_COLORS[event.category] || 'bg-gray-400';
                const linkedRec = event.linkedRecordId ? getLinkedRecord(event.linkedRecordId) : null;

                return (
                  <div key={event.id} className="relative flex gap-5">
                    {/* Icon circle */}
                    <div className={`relative z-10 w-10 h-10 rounded-full ${dotColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content card */}
                    <div className="flex-1 pb-2">
                      <Card className="hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                          <div>
                            <p className="text-xs text-[#64748B] mb-1">{formatDate(event.date)}</p>
                            <h3 className="text-base font-semibold text-[#163B65]">{event.title}</h3>
                          </div>
                          <Badge color={BADGE_COLORS[event.category] || 'gray'} size="sm">
                            {event.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#64748B]">{event.description}</p>
                        {linkedRec && (
                          <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
                            <Link to="/records" className="inline-flex items-center gap-2 text-xs font-medium text-[#2476C7] hover:text-[#1d63a8]">
                              <FileText className="w-3.5 h-3.5" />
                              Linked: {linkedRec.title}
                            </Link>
                          </div>
                        )}
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-xs text-center text-[#94A3B8] mt-10">
          Timeline generated from fictional demo records. Sorted newest to oldest.
        </p>
      </div>
    </AppLayout>
  );
}
