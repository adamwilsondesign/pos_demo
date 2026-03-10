import { Tag, Calendar, Percent, Package, CheckCircle } from 'lucide-react';
import { Badge } from '../shared/Badge';
import { Toggle } from '../shared/Toggle';
import { useState } from 'react';

export function DiscountConfig() {
  const [fapActive, setFapActive] = useState(true);
  const [promoActive, setPromoActive] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto p-6 fade-in bg-[#0d1b21]">
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Discounts & Promotions</h1>
          <p className="text-[13px] text-[#5a8a9a] mt-1">Configure municipal discount programs and promotional pricing</p>
        </div>

        {/* Municipal Fee Assistance */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <Tag size={22} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-white">Municipal Fee Assistance Program</h2>
                <p className="text-[12px] text-[#5a8a9a]">Card-based discount for eligible residents</p>
              </div>
            </div>
            <Badge variant="green">Active</Badge>
          </div>

          <div className="space-y-4">
            <Toggle checked={fapActive} onChange={setFapActive} label="Program Active" />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Discount Type" value="Fixed Amount" />
              <Field label="Verification" value="FAP Card Required" />
              <Field label="Auto Apply" value="Manual — Cashier applies" />
              <Field label="Stackable" value="No — Exclusive discount" />
            </div>

            <div className="mt-4">
              <h4 className="text-[13px] font-semibold text-white mb-3">Eligible Items & Discount</h4>
              <div className="space-y-2">
                <DiscountRow item="Garbage Bag Tag" original={4.00} discounted={2.00} />
                <DiscountRow item="Blue Box" original={8.00} discounted={4.00} />
                <DiscountRow item="Green Bin" original={12.00} discounted={6.00} />
                <DiscountRow item="Dog Tag" original={25.00} discounted={15.00} />
              </div>
            </div>
          </div>
        </div>

        {/* Promotional */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
                <Percent size={22} className="text-amber-400" />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-white">Spring Cleanup Promotion</h2>
                <p className="text-[12px] text-[#5a8a9a]">Seasonal bag tag promotion</p>
              </div>
            </div>
            <Badge variant="amber">Scheduled</Badge>
          </div>

          <div className="space-y-4">
            <Toggle checked={promoActive} onChange={setPromoActive} label="Promotion Active" />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Discount Type" value="Percentage — 25% off" icon={<Percent size={12} />} />
              <Field label="Valid Period" value="Apr 1 — Apr 30, 2026" icon={<Calendar size={12} />} />
              <Field label="Eligible Items" value="Garbage Bag Tags only" icon={<Package size={12} />} />
              <Field label="Max Uses" value="Unlimited" />
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 mt-3">
              <p className="text-[12px] text-amber-400/60">
                This promotion automatically applies to all Garbage Bag Tag purchases from April 1-30, 2026.
                Cannot be combined with Municipal Fee Assistance Program discounts.
              </p>
            </div>
          </div>
        </div>

        {/* Discount log */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4">Recent Discount Activity</h3>
          <div className="space-y-0">
            <ActivityRow time="2:15 PM" cashier="Maria Lopez" action='Applied "Municipal Fee Assistance" — Bag Tag $4.00 → $2.00' />
            <ActivityRow time="1:42 PM" cashier="James Wilson" action='Applied "Municipal Fee Assistance" — Dog Tag $25.00 → $15.00' />
            <ActivityRow time="11:30 AM" cashier="Sarah Kim" action='Applied "Municipal Fee Assistance" — Blue Box $8.00 → $4.00' />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="p-3 bg-[#0d1b21] rounded-xl">
      <div className="text-[10px] text-[#5a8a9a] uppercase tracking-widest font-semibold mb-1">{label}</div>
      <div className="text-[13px] font-medium text-white flex items-center gap-1.5">
        {icon}{value}
      </div>
    </div>
  );
}

function DiscountRow({ item, original, discounted }: { item: string; original: number; discounted: number }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-3 bg-[#0d1b21] rounded-xl">
      <div className="flex items-center gap-2">
        <CheckCircle size={14} className="text-emerald-400" />
        <span className="text-[13px] text-white">{item}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-[#3a6070] line-through">${original.toFixed(2)}</span>
        <span className="text-[13px] font-semibold text-emerald-400">${discounted.toFixed(2)}</span>
      </div>
    </div>
  );
}

function ActivityRow({ time, cashier, action }: { time: string; cashier: string; action: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[#1a3d48] last:border-0">
      <span className="text-[12px] text-[#3a6070] shrink-0 w-16">{time}</span>
      <span className="text-[12px] text-[#7ab0c0] shrink-0 w-24">{cashier}</span>
      <span className="text-[12px] text-[#c8dce4]">{action}</span>
    </div>
  );
}
