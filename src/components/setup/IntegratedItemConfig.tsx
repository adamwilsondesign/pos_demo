import { useState } from 'react';
import { Link, ExternalLink, Database, RefreshCw, Lock, Loader2 } from 'lucide-react';
import { Badge } from '../shared/Badge';

export function IntegratedItemConfig({ onSave }: { onSave?: (msg: string) => void }) {
  const [testing, setTesting] = useState<string | null>(null);

  const handleTestConnection = (name: string) => {
    setTesting(name);
    setTimeout(() => {
      setTesting(null);
      onSave?.(`${name} — Connection test successful`);
    }, 1200);
  };
  return (
    <div className="flex-1 overflow-y-auto p-6 fade-in bg-[#0d1b21]">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-white tracking-tight">Integrated Item Configuration</h1>
            <p className="text-[13px] text-[#5a8a9a] mt-1">Items sourced from external municipal systems</p>
          </div>
          <Badge variant="amber">Integrated</Badge>
        </div>

        {/* Item details */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Link size={22} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-white">Permit Fee</h2>
              <p className="text-[12px] text-[#5a8a9a]">Dynamically sourced from Permits & Licensing</p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2 text-amber-400 text-[13px] font-semibold mb-1">
              <ExternalLink size={14} />
              External Source Item
            </div>
            <p className="text-[12px] text-amber-400/60">
              This item's price and availability are retrieved from the Permits & Licensing system at transaction time.
              The POS cannot directly edit the fee amount — it is controlled by the source system.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Item Name" value="Building Permit Fee" />
            <Field label="Category" value="Permits & Licensing" />
            <Field label="Price Source" value="External System" icon={<Database size={13} className="text-amber-400" />} locked />
            <Field label="Reference" value="PER-2026-18" />
          </div>
        </div>

        {/* Source system */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4 flex items-center gap-2">
            <Database size={17} className="text-blue-400" />
            Source System Configuration
          </h3>
          <div className="space-y-0">
            <ConfigRow label="Source System" value="Permits & Licensing API" />
            <ConfigRow label="API Endpoint" value="permits.kingston.ca/api/v2" />
            <ConfigRow label="Sync Method" value="Real-time Lookup" />
            <ConfigRow label="Last Health Check" value="Mar 9, 2026 — 1:47 PM" status="green" />
            <ConfigRow label="Fallback Behavior" value="Queue for manual lookup" />
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4">Static vs Integrated Comparison</h3>
          <div className="overflow-hidden rounded-xl border border-[#1a3d48]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-[#0d1b21]">
                  <th className="text-left px-4 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Feature</th>
                  <th className="text-left px-4 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Static</th>
                  <th className="text-left px-4 py-3 text-[#5a8a9a] font-semibold text-[11px] uppercase tracking-widest">Integrated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a3d48]">
                <CompareRow feature="Price" static_="Fixed in POS" integrated="From source system" />
                <CompareRow feature="Availability" static_="Configured per location" integrated="Based on source lookup" />
                <CompareRow feature="Edit Price" static_="Yes — admin" integrated="No — source controls" />
                <CompareRow feature="Account Ref" static_="Manual mapping" integrated="Auto from source" />
                <CompareRow feature="Sync" static_="None" integrated="Real-time API" />
              </tbody>
            </table>
          </div>
        </div>

        {/* Connected systems */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4 flex items-center gap-2">
            <RefreshCw size={17} className="text-blue-400" />
            Connected External Systems
          </h3>
          <div className="space-y-2">
            <SystemRow name="Property Tax System" status="Connected" type="Municipal" testing={testing} onTest={handleTestConnection} />
            <SystemRow name="Kingston Transit" status="Connected" type="Transit" testing={testing} onTest={handleTestConnection} />
            <SystemRow name="Dynamics 365" status="Connected" type="ERP" testing={testing} onTest={handleTestConnection} />
            <SystemRow name="Parking Enforcement" status="Connected" type="Enforcement" testing={testing} onTest={handleTestConnection} />
            <SystemRow name="Permits & Licensing" status="Connected" type="Licensing" testing={testing} onTest={handleTestConnection} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, icon, locked }: { label: string; value: string; icon?: React.ReactNode; locked?: boolean }) {
  return (
    <div className="p-3 bg-[#0d1b21] rounded-xl">
      <div className="text-[10px] text-[#5a8a9a] uppercase tracking-widest font-semibold mb-1 flex items-center gap-1">
        {label}
        {locked && <Lock size={10} className="text-amber-400" />}
      </div>
      <div className="text-[13px] font-medium text-white flex items-center gap-1.5">
        {icon}
        {value}
      </div>
    </div>
  );
}

function ConfigRow({ label, value, status }: { label: string; value: string; status?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#1a3d48] last:border-0">
      <span className="text-[13px] text-[#7ab0c0]">{label}</span>
      <span className={`text-[13px] font-medium ${status === 'green' ? 'text-emerald-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function CompareRow({ feature, static_, integrated }: { feature: string; static_: string; integrated: string }) {
  return (
    <tr>
      <td className="px-4 py-2.5 text-white font-medium">{feature}</td>
      <td className="px-4 py-2.5 text-[#7ab0c0]">{static_}</td>
      <td className="px-4 py-2.5 text-amber-400">{integrated}</td>
    </tr>
  );
}

function SystemRow({ name, status, type, testing, onTest }: { name: string; status: string; type: string; testing: string | null; onTest: (name: string) => void }) {
  const isThisTesting = testing === name;
  return (
    <div className="flex items-center justify-between py-2.5 px-3 bg-[#0d1b21] rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <div>
          <div className="text-[13px] text-white">{name}</div>
          <div className="text-[11px] text-[#5a8a9a]">{type}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onTest(name)}
          disabled={!!testing}
          className="text-[11px] text-blue-400 hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-[#112a33] font-medium transition-colors disabled:opacity-40"
        >
          {isThisTesting ? <Loader2 size={12} className="animate-spin" /> : 'Test'}
        </button>
        <Badge variant="green">{status}</Badge>
      </div>
    </div>
  );
}
