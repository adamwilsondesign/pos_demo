import { User, Shield, MapPin, Key, Monitor, CheckCircle } from 'lucide-react';
import { Badge } from '../shared/Badge';

export function StaffAccess() {
  return (
    <div className="flex-1 overflow-y-auto p-6 fade-in bg-[#0d1b21]">
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Staff Access Context</h1>
          <p className="text-[13px] text-[#5a8a9a] mt-1">Current session and authentication details</p>
        </div>

        {/* Current session */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/15 flex items-center justify-center">
              <User size={28} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-white">Maria Lopez</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="blue">Cashier</Badge>
                <Badge variant="green">Active</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoRow icon={<MapPin size={15} />} label="Location" value="Kingston Service Counter" />
            <InfoRow icon={<Shield size={15} />} label="Role" value="Cashier" />
            <InfoRow icon={<Key size={15} />} label="Auth Method" value="Microsoft Entra ID (SSO)" />
            <InfoRow icon={<Monitor size={15} />} label="Terminal" value="POS-KC-01" />
          </div>
        </div>

        {/* SSO info */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4 flex items-center gap-2">
            <Shield size={17} className="text-blue-400" />
            Single Sign-On Configuration
          </h3>
          <div className="space-y-0">
            <ConfigRow label="Identity Provider" value="Microsoft Entra ID" />
            <ConfigRow label="SSO Protocol" value="SAML 2.0 / OpenID Connect" />
            <ConfigRow label="Directory Sync" value="Enabled — Active Directory" />
            <ConfigRow label="MFA Enforcement" value="Required for Supervisor+" />
            <ConfigRow label="Session Timeout" value="8 hours (shift-based)" />
            <ConfigRow label="Last Sync" value="Mar 9, 2026 — 06:00 AM" />
          </div>
        </div>

        {/* Permissions summary */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4">Cashier Permissions</h3>
          <div className="grid grid-cols-2 gap-2.5">
            <PermItem allowed label="Process transactions" />
            <PermItem allowed label="Accept all payment types" />
            <PermItem allowed label="Apply configured discounts" />
            <PermItem allowed label="Look up external balances" />
            <PermItem allowed label="Issue receipts" />
            <PermItem allowed label="View own transaction history" />
            <PermItem allowed={false} label="Process refunds >$50" />
            <PermItem allowed={false} label="Void transactions" />
            <PermItem allowed={false} label="Modify item configuration" />
            <PermItem allowed={false} label="Close register" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#0d1b21] rounded-xl">
      <div className="text-[#5a8a9a]">{icon}</div>
      <div>
        <div className="text-[10px] text-[#5a8a9a] uppercase tracking-widest font-semibold">{label}</div>
        <div className="text-[13px] font-medium text-white">{value}</div>
      </div>
    </div>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#1a3d48] last:border-0">
      <span className="text-[13px] text-[#7ab0c0]">{label}</span>
      <span className="text-[13px] font-medium text-white">{value}</span>
    </div>
  );
}

function PermItem({ allowed, label }: { allowed: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px]">
      <CheckCircle size={14} className={allowed ? 'text-emerald-400' : 'text-[#1a3d48]'} />
      <span className={allowed ? 'text-[#c8dce4]' : 'text-[#3a6070]'}>{label}</span>
    </div>
  );
}
