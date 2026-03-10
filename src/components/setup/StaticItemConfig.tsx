import { useState } from 'react';
import { Package, DollarSign, MapPin, BookOpen, Globe, Calculator } from 'lucide-react';
import { Toggle } from '../shared/Toggle';
import { Badge } from '../shared/Badge';

export function StaticItemConfig({ onSave }: { onSave?: (msg: string) => void }) {
  const [onlineEnabled, setOnlineEnabled] = useState(true);
  const [posEnabled, setPosEnabled] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto p-6 fade-in bg-[#0d1b21]">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-white tracking-tight">Static Item Configuration</h1>
            <p className="text-[13px] text-[#5a8a9a] mt-1">Items with fixed prices managed directly in the POS</p>
          </div>
          <Badge variant="blue">Static</Badge>
        </div>

        {/* Item details */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <Package size={22} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-white">Garbage Bag Tag</h2>
              <p className="text-[12px] text-[#5a8a9a]">SKU: KGN-WASTE-001</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Item Name" value="Garbage Bag Tag" />
            <Field label="Category" value="Waste Management" />
            <Field label="Price" value="$4.00" icon={<DollarSign size={13} />} />
            <Field label="Unit" value="Per Tag" />
          </div>
        </div>

        {/* Location */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin size={17} className="text-blue-400" />
            Location Availability
          </h3>
          <div className="space-y-2">
            <LocationRow location="Kingston Service Counter" available />
            <LocationRow location="City Hall Kiosk" available={false} />
            <LocationRow location="Memorial Centre" available={false} />
          </div>
        </div>

        {/* GL Mapping */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen size={17} className="text-blue-400" />
            GL Account Mapping
          </h3>
          <div className="space-y-0">
            <ConfigRow label="GL Account" value="41-2100-001" />
            <ConfigRow label="D365 Revenue Code" value="REV-WASTE-BAG" />
            <ConfigRow label="Cost Centre" value="CC-WASTE" />
            <ConfigRow label="Department" value="Waste Management" />
          </div>
        </div>

        {/* Channel config */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4 flex items-center gap-2">
            <Globe size={17} className="text-blue-400" />
            Channel Configuration
          </h3>
          <div className="space-y-4">
            <Toggle checked={posEnabled} onChange={setPosEnabled} label="Available at POS Counter" />
            <Toggle checked={onlineEnabled} onChange={setOnlineEnabled} label="Available for Online Payment" />
          </div>
        </div>

        {/* Tax */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4 flex items-center gap-2">
            <Calculator size={17} className="text-blue-400" />
            Tax Configuration
          </h3>
          <div className="space-y-0">
            <ConfigRow label="Tax Treatment" value="HST Taxable" />
            <ConfigRow label="Tax Rate" value="13% (Ontario HST)" />
            <ConfigRow label="Tax Code" value="HST-ON-13" />
            <ConfigRow label="Convenience Fee" value="Not Applicable" />
          </div>
        </div>
        {/* Save button */}
        <button
          onClick={() => onSave?.('Static item configuration saved')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-[16px] font-semibold rounded-2xl transition-all duration-150 active:scale-[0.98] shadow-lg shadow-blue-600/20"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="p-3 bg-[#0d1b21] rounded-xl">
      <div className="text-[10px] text-[#5a8a9a] uppercase tracking-widest font-semibold mb-1">{label}</div>
      <div className="text-[13px] font-medium text-white flex items-center gap-1.5">
        {icon}
        {value}
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

function LocationRow({ location, available }: { location: string; available: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-3 bg-[#0d1b21] rounded-xl">
      <span className="text-[13px] text-white">{location}</span>
      <Badge variant={available ? 'green' : 'gray'}>{available ? 'Enabled' : 'Disabled'}</Badge>
    </div>
  );
}
