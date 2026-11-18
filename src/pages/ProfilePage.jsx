import { useState } from 'react';
import { User, Edit2, Save, X, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppLayout } from '../components/Layout';
import { Card, Button, Input, Select, Badge, SectionHeader, DemoNotice, formatDate, getAge } from '../components/ui';

const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function ProfilePage() {
  const { profile, updateProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ ...profile, allergiesText: profile.allergies?.join(', ') || '' });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const handleSave = () => {
    const errs = {};
    if (!form.name?.trim()) errs.name = 'Name is required.';
    if (!form.dob) errs.dob = 'Date of birth is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const allergies = form.allergiesText
      ? form.allergiesText.split(',').map(a => a.trim()).filter(Boolean)
      : [];
    updateProfile({ ...form, allergies });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm({ ...profile, allergiesText: profile.allergies?.join(', ') || '' });
    setErrors({});
    setEditing(false);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Health Profile"
          description="Your personal health information, kept organised in one place."
          action={
            !editing
              ? <Button onClick={() => setEditing(true)} variant="primary" size="sm">
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </Button>
              : <div className="flex gap-2">
                  <Button onClick={handleCancel} variant="outline" size="sm"><X className="w-4 h-4" /> Cancel</Button>
                  <Button onClick={handleSave} variant="primary" size="sm"><Save className="w-4 h-4" /> Save Changes</Button>
                </div>
          }
        />

        {saved && (
          <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium">Profile updated successfully.</p>
          </div>
        )}

        <DemoNotice message="All profile information is fictional and for demonstration purposes only. This prototype does not verify or store real health data." />

        <div className="mt-6 space-y-6">
          {/* Avatar & Name */}
          <Card>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#163B65] flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  {profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#163B65]">{profile.name}</h2>
                <p className="text-[#64748B] mt-1">
                  Age {getAge(profile.dob)} · {profile.gender} · Blood Group <Badge color="red">{profile.bloodGroup}</Badge>
                </p>
                <p className="text-xs text-[#64748B] mt-2">Demo patient — all data is fictional</p>
              </div>
            </div>
          </Card>

          {/* Personal Details */}
          <Card>
            <h3 className="text-base font-semibold text-[#163B65] mb-5 flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {editing ? (
                <>
                  <Input id="pf-name" label="Full name" value={form.name} onChange={e => update('name', e.target.value)} error={errors.name} />
                  <Input id="pf-dob" label="Date of birth" type="date" value={form.dob} onChange={e => update('dob', e.target.value)} error={errors.dob} />
                  <Select id="pf-gender" label="Gender" value={form.gender} onChange={e => update('gender', e.target.value)}>
                    {genders.map(g => <option key={g}>{g}</option>)}
                  </Select>
                  <Select id="pf-blood" label="Blood group" value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)}>
                    {bloodGroups.map(bg => <option key={bg}>{bg}</option>)}
                  </Select>
                  <Input id="pf-height" label="Height" placeholder="175 cm" value={form.height} onChange={e => update('height', e.target.value)} />
                  <Input id="pf-weight" label="Weight" placeholder="72 kg" value={form.weight} onChange={e => update('weight', e.target.value)} />
                </>
              ) : (
                <>
                  <ReadField label="Full name" value={profile.name} />
                  <ReadField label="Date of birth" value={formatDate(profile.dob)} />
                  <ReadField label="Gender" value={profile.gender} />
                  <ReadField label="Blood group" value={<Badge color="red">{profile.bloodGroup}</Badge>} />
                  <ReadField label="Height" value={profile.height} />
                  <ReadField label="Weight" value={profile.weight} />
                </>
              )}
            </div>
          </Card>

          {/* Medical Info */}
          <Card>
            <h3 className="text-base font-semibold text-[#163B65] mb-5">Medical Information</h3>
            <div className="space-y-5">
              {editing ? (
                <>
                  <Input
                    id="pf-allergies"
                    label="Known allergies (comma-separated)"
                    placeholder="Penicillin, Aspirin…"
                    value={form.allergiesText}
                    onChange={e => update('allergiesText', e.target.value)}
                  />
                  <Input
                    id="pf-chronic"
                    label="Chronic conditions (comma-separated)"
                    placeholder="Type 2 Diabetes, Hypertension…"
                    value={form.chronicConditions?.join(', ') || ''}
                    onChange={e => update('chronicConditions', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  />
                  <Input
                    id="pf-surgeries"
                    label="Past surgeries (comma-separated)"
                    placeholder="Appendectomy 2019…"
                    value={form.pastSurgeries?.join(', ') || ''}
                    onChange={e => update('pastSurgeries', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  />
                </>
              ) : (
                <>
                  <ReadField label="Known allergies" value={
                    profile.allergies?.length
                      ? <div className="flex flex-wrap gap-1">{profile.allergies.map(a => <Badge key={a} color="orange">{a}</Badge>)}</div>
                      : 'None recorded'
                  } />
                  <ReadField label="Chronic conditions" value={profile.chronicConditions?.length ? profile.chronicConditions.join(', ') : 'None recorded'} />
                  <ReadField label="Past surgeries" value={profile.pastSurgeries?.length ? profile.pastSurgeries.join(', ') : 'None recorded'} />
                </>
              )}
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <h3 className="text-base font-semibold text-[#163B65] mb-5">Emergency Contact</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {editing ? (
                <>
                  <Input
                    id="pf-ec-name"
                    label="Contact name"
                    value={form.emergencyContact?.name || ''}
                    onChange={e => update('emergencyContact', { ...form.emergencyContact, name: e.target.value })}
                  />
                  <Input
                    id="pf-ec-rel"
                    label="Relationship"
                    value={form.emergencyContact?.relationship || ''}
                    onChange={e => update('emergencyContact', { ...form.emergencyContact, relationship: e.target.value })}
                  />
                  <Input
                    id="pf-ec-phone"
                    label="Contact number (masked)"
                    placeholder="+91 98XXX XXXXX"
                    value={form.emergencyContact?.phone || ''}
                    onChange={e => update('emergencyContact', { ...form.emergencyContact, phone: e.target.value })}
                  />
                </>
              ) : (
                <>
                  <ReadField label="Contact name" value={profile.emergencyContact?.name} />
                  <ReadField label="Relationship" value={profile.emergencyContact?.relationship} />
                  <ReadField label="Contact number" value={profile.emergencyContact?.phone} />
                </>
              )}
            </div>
            <p className="text-xs text-[#64748B] mt-4 italic">
              Contact details are masked in this demonstration.
            </p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function ReadField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#64748B] uppercase tracking-wide mb-1">{label}</p>
      <div className="text-sm text-[#1F2937] font-medium">
        {typeof value === 'string' ? value || '—' : value || '—'}
      </div>
    </div>
  );
}
