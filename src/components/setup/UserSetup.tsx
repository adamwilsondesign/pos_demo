import { useState } from 'react';
import { Shield, MapPin, Key, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { Badge } from '../shared/Badge';

export function UserSetup({ onSave }: { onSave?: (msg: string) => void }) {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Cashier');

  const handleInvite = () => {
    if (inviteName && inviteEmail) {
      onSave?.(`Invitation sent to ${inviteName} (${inviteEmail})`);
      setShowInvite(false);
      setInviteName('');
      setInviteEmail('');
      setInviteRole('Cashier');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 fade-in bg-[#0d1b21]">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-white tracking-tight">Users & Role Configuration</h1>
            <p className="text-[13px] text-[#5a8a9a] mt-1">Manage staff roles, permissions, and location access</p>
          </div>
          <button
            onClick={() => setShowInvite(!showInvite)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-[12px] font-medium text-white transition-all active:scale-[0.98]"
          >
            <UserPlus size={13} />
            Invite User
          </button>
        </div>

        {showInvite && (
          <div className="bg-[#112a33] rounded-2xl border border-blue-500/30 p-5 fade-in">
            <h4 className="text-[14px] font-semibold text-white mb-3">New User Invitation</h4>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={inviteName}
                onChange={e => setInviteName(e.target.value)}
                className="bg-[#0d1b21] border border-[#1a3d48] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder-[#3a6070] focus:outline-none focus:border-blue-500/50"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="bg-[#0d1b21] border border-[#1a3d48] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder-[#3a6070] focus:outline-none focus:border-blue-500/50"
              />
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
                className="bg-[#0d1b21] border border-[#1a3d48] rounded-xl px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-blue-500/50"
              >
                <option>Cashier</option>
                <option>Supervisor</option>
                <option>Administrator</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleInvite}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-[12px] font-medium text-white transition-all active:scale-[0.98]"
              >
                Send Invitation
              </button>
              <button
                onClick={() => setShowInvite(false)}
                className="px-4 py-2 bg-[#0d1b21] border border-[#1a3d48] rounded-xl text-[12px] font-medium text-[#5a8a9a] hover:text-white transition-all"
              >
                Cancel
              </button>
              <span className="text-[11px] text-[#3a6070] ml-2">SSO provisioned via Microsoft Entra ID</span>
            </div>
          </div>
        )}

        {/* Roles */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4 flex items-center gap-2">
            <Shield size={17} className="text-blue-400" />
            Role Definitions
          </h3>
          <div className="space-y-3">
            <RoleCard
              name="Cashier"
              description="Standard counter staff — processes transactions and lookups"
              users={['Maria Lopez', 'James Wilson', 'Sarah Kim']}
              permissions={['Process transactions', 'Accept payments', 'Lookup balances', 'Apply discounts', 'Issue receipts']}
              denied={['Void transactions', 'Process refunds >$50', 'Close register', 'Edit items']}
            />
            <RoleCard
              name="Supervisor"
              description="Shift lead — elevated permissions for overrides and closeout"
              users={['Robert Taylor']}
              permissions={['All Cashier permissions', 'Process all refunds', 'Void transactions', 'Override pricing', 'Close register', 'Run reports']}
              denied={['Edit item configuration', 'Manage users', 'System settings']}
            />
            <RoleCard
              name="Administrator"
              description="Full system access — configuration and management"
              users={['System Admin']}
              permissions={['All Supervisor permissions', 'Item configuration', 'User management', 'System settings', 'GL mapping', 'Integration config']}
              denied={[]}
            />
          </div>
        </div>

        {/* Locations */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin size={17} className="text-blue-400" />
            Location Permissions
          </h3>
          <div className="overflow-hidden rounded-xl border border-[#1a3d48]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-[#0d1b21]">
                  <th className="text-left px-4 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Staff</th>
                  <th className="text-center px-4 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Service Counter</th>
                  <th className="text-center px-4 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">City Hall</th>
                  <th className="text-center px-4 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Memorial Centre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a3d48]">
                <LocRow name="Maria Lopez" locs={[true, false, false]} />
                <LocRow name="James Wilson" locs={[true, true, false]} />
                <LocRow name="Sarah Kim" locs={[false, true, true]} />
                <LocRow name="Robert Taylor" locs={[true, true, true]} />
              </tbody>
            </table>
          </div>
        </div>

        {/* SSO */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4 flex items-center gap-2">
            <Key size={17} className="text-blue-400" />
            Authentication & SSO
          </h3>
          <div className="space-y-0">
            <ConfigRow label="Identity Provider" value="Microsoft Entra ID" />
            <ConfigRow label="Provisioning" value="SCIM — Auto Sync" />
            <ConfigRow label="MFA" value="Required for Supervisor and above" />
            <ConfigRow label="Password Policy" value="Managed by Entra ID" />
            <ConfigRow label="Failed Login Lockout" value="5 attempts / 15 min lockout" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ name, description, users, permissions, denied }: {
  name: string; description: string; users: string[]; permissions: string[]; denied: string[];
}) {
  return (
    <div className="bg-[#0d1b21] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-[14px] font-semibold text-white">{name}</h4>
          <p className="text-[12px] text-[#5a8a9a]">{description}</p>
        </div>
        <Badge variant="blue">{users.length} user{users.length !== 1 ? 's' : ''}</Badge>
      </div>
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {users.map(u => (
          <span key={u} className="text-[11px] bg-[#112a33] px-2 py-0.5 rounded-md text-[#7ab0c0] font-medium">{u}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {permissions.map(p => (
          <div key={p} className="flex items-center gap-1.5 text-[12px] text-emerald-400">
            <CheckCircle size={11} />
            {p}
          </div>
        ))}
        {denied.map(d => (
          <div key={d} className="flex items-center gap-1.5 text-[12px] text-[#3a6070]">
            <XCircle size={11} />
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

function LocRow({ name, locs }: { name: string; locs: boolean[] }) {
  return (
    <tr>
      <td className="px-4 py-2.5 text-white text-[13px]">{name}</td>
      {locs.map((l, i) => (
        <td key={i} className="text-center px-4 py-2.5">
          {l ? <CheckCircle size={16} className="text-emerald-400 mx-auto" /> : <XCircle size={16} className="text-[#1a3d48] mx-auto" />}
        </td>
      ))}
    </tr>
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
