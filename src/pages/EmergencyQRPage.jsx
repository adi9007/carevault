import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import {
  QrCode, Download, Printer, RefreshCw, Eye, AlertTriangle,
  Shield, Droplets, Pill, Activity, Phone, Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppLayout } from '../components/Layout';
import { Card, Button, Badge, SectionHeader, DemoNotice, formatDate } from '../components/ui';

export default function EmergencyQRPage() {
  const { profile, medications, qrToken } = useApp();
  const navigate = useNavigate();
  const [currentToken, setCurrentToken] = useState(qrToken);
  const [regenerating, setRegenerating] = useState(false);

  const emergencyUrl = `${window.location.origin}/emergency/view/${currentToken}`;

  const activeMeds = medications.filter(m => m.status === 'Active');

  const handleRegenerate = async () => {
    setRegenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newToken = `cv-emrg-${Math.random().toString(36).substring(2, 14)}`;
    setCurrentToken(newToken);
    setRegenerating(false);
  };

  const handleDownload = () => {
    const canvas = document.querySelector('#emergency-qr canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'carevault-emergency-qr.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handlePrint = () => window.print();

  const handleSimulateScan = () => {
    navigate(`/emergency/view/${currentToken}`);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto no-print">
        <SectionHeader
          title="Emergency Health QR"
          description="Make essential health information easier to access when you may not be able to communicate."
        />

        <DemoNotice message="Demo notice: this QR profile uses fictional information and is not intended for real emergency care. Production use would require server-side access controls, token revocation, and a carefully reviewed emergency-access policy." />

        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          {/* QR Card */}
          <Card className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-600">Demo QR Active</span>
            </div>
            <h2 className="text-lg font-bold text-[#163B65] mb-1">Emergency Health QR</h2>
            <p className="text-xs text-[#64748B] mb-6">
              Last updated: {formatDate(new Date().toISOString())}
            </p>

            {/* QR Code */}
            <div id="emergency-qr" className="p-4 bg-white border-4 border-[#163B65] rounded-2xl shadow-lg mb-6">
              <QRCode
                value={emergencyUrl}
                size={180}
                level="H"
                includeMargin={true}
                fgColor="#163B65"
              />
            </div>

            <p className="text-xs text-[#64748B] mb-1 font-medium">QR points to demo emergency URL</p>
            <p className="text-xs text-[#94A3B8] break-all px-4 mb-6">
              Token: {currentToken}
            </p>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button variant="primary" onClick={handleSimulateScan}>
                <Eye className="w-4 h-4" /> Preview Profile
              </Button>
              <Button variant="outline" onClick={handleRegenerate} disabled={regenerating}>
                <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
                {regenerating ? 'Generating…' : 'Regenerate'}
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4" /> Download QR
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4" /> Print QR
              </Button>
            </div>

            <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 text-left">
              <p className="font-medium mb-1">Simulate a scan</p>
              <p>Click "Preview Profile" to see exactly what a first responder would see when scanning this QR code.</p>
            </div>
          </Card>

          {/* Emergency profile preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#163B65]" />
              <h3 className="text-base font-semibold text-[#163B65]">Emergency Profile Preview</h3>
            </div>
            <p className="text-sm text-[#64748B]">
              Only these fields are disclosed when the QR is scanned. Full medical records are never exposed.
            </p>

            <EmergencyField
              icon={<Droplets className="w-5 h-5 text-red-500" />}
              label="Blood Group"
              value={<Badge color="red" size="md">{profile.bloodGroup}</Badge>}
              highlight
            />

            <EmergencyField
              icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
              label="Known Allergies"
              value={
                profile.allergies?.length
                  ? <div className="flex flex-wrap gap-1.5">{profile.allergies.map(a => <Badge key={a} color="orange">{a}</Badge>)}</div>
                  : <span className="text-sm text-[#64748B]">None recorded</span>
              }
              highlight
            />

            <EmergencyField
              icon={<Pill className="w-5 h-5 text-teal-500" />}
              label="Current Medications"
              value={
                activeMeds.length
                  ? <div className="space-y-1">
                      {activeMeds.map(m => (
                        <p key={m.id} className="text-sm text-[#1F2937] font-medium">{m.name} — {m.dosage} · {m.frequency}</p>
                      ))}
                    </div>
                  : <span className="text-sm text-[#64748B]">None recorded</span>
              }
            />

            <EmergencyField
              icon={<Activity className="w-5 h-5 text-purple-500" />}
              label="Chronic Conditions"
              value={
                profile.chronicConditions?.length
                  ? profile.chronicConditions.join(', ')
                  : <span className="text-sm text-[#64748B]">None recorded</span>
              }
            />

            <EmergencyField
              icon={<Phone className="w-5 h-5 text-green-500" />}
              label="Emergency Contact"
              value={
                <div>
                  <p className="text-sm font-medium text-[#1F2937]">{profile.emergencyContact?.name}</p>
                  <p className="text-xs text-[#64748B]">{profile.emergencyContact?.relationship} · {profile.emergencyContact?.phone}</p>
                </div>
              }
            />

            {/* Not disclosed */}
            <div className="p-4 bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-[#64748B]" />
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Not disclosed via QR</p>
              </div>
              <ul className="text-xs text-[#64748B] space-y-1">
                <li>• Full medical reports and imaging documents</li>
                <li>• Detailed prescription history</li>
                <li>• Private record sharing links</li>
                <li>• Login credentials or account information</li>
                <li>• Complete medical history</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security note */}
        <Card className="mt-6 border-l-4 border-l-[#2476C7]">
          <div className="flex gap-4">
            <Shield className="w-6 h-6 text-[#2476C7] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#163B65] mb-1">About Emergency QR Security</p>
              <p className="text-sm text-[#64748B]">
                In this demonstration, the QR code contains a demo URL with an opaque token. Medical information is not embedded
                directly in the QR image. In a production system, the token would be validated server-side with access controls,
                rate limiting, token revocation, and a carefully reviewed emergency-access policy. The frontend prototype alone
                cannot guarantee secure access.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

function EmergencyField({ icon, label, value, highlight = false }) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-white border-[#E2E8F0]' : 'bg-[#F5F8FC] border-[#E2E8F0]'}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">{label}</span>
      </div>
      <div>{value}</div>
    </div>
  );
}
