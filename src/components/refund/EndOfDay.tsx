import { useState } from 'react';
import { DollarSign, CreditCard, Banknote, FileCheck, RotateCcw, Percent, CheckCircle, Lock } from 'lucide-react';
import { END_OF_DAY, CASHIER } from '../../stores/demoData';
import { Badge } from '../shared/Badge';

export function EndOfDay() {
  const [closed, setClosed] = useState(false);

  const balanced = END_OF_DAY.expectedTotal === END_OF_DAY.actualTotal;

  return (
    <div className="flex-1 overflow-y-auto p-6 fade-in bg-[#0d1b21]">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-white tracking-tight">End of Day Balancing</h1>
            <p className="text-[13px] text-[#5a8a9a] mt-1">
              {CASHIER.name} — {CASHIER.location} — March 9, 2026
            </p>
          </div>
          <Badge variant={closed ? 'green' : 'amber'}>{closed ? 'Closed' : 'Open'}</Badge>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <SummaryCard icon={<Banknote size={20} />} label="Total Cash" value={END_OF_DAY.totalCash} color="text-emerald-400" bgColor="bg-emerald-500/10" />
          <SummaryCard icon={<CreditCard size={20} />} label="Total Credit" value={END_OF_DAY.totalCredit} color="text-blue-400" bgColor="bg-blue-500/10" />
          <SummaryCard icon={<FileCheck size={20} />} label="Total Cheque" value={END_OF_DAY.totalCheque} color="text-amber-400" bgColor="bg-amber-500/10" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <SummaryCard icon={<RotateCcw size={20} />} label="Refunds" value={END_OF_DAY.totalRefunds} color="text-red-400" bgColor="bg-red-500/10" negative />
          <SummaryCard icon={<Percent size={20} />} label="Conv. Fees" value={END_OF_DAY.totalConvenienceFees} color="text-purple-400" bgColor="bg-purple-500/10" />
          <SummaryCard icon={<DollarSign size={20} />} label="Transactions" value={END_OF_DAY.transactionCount} color="text-[#7ab0c0]" bgColor="bg-[#163540]" count />
        </div>

        {/* Balancing */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4">Register Balancing</h3>
          <div className="space-y-2">
            <BalanceRow label="Cash Received" value={END_OF_DAY.totalCash} />
            <BalanceRow label="Credit Card Received" value={END_OF_DAY.totalCredit} />
            <BalanceRow label="Cheque Received" value={END_OF_DAY.totalCheque} />
            <BalanceRow label="Less: Refunds" value={-END_OF_DAY.totalRefunds} negative />
            <div className="border-t border-[#1a3d48] pt-3 mt-3">
              <BalanceRow label="Expected Total" value={END_OF_DAY.expectedTotal} bold />
            </div>
            <div className="border-t border-[#1a3d48] pt-3">
              <BalanceRow label="Actual Total" value={END_OF_DAY.actualTotal} bold />
            </div>
            <div className="border-t border-[#1a3d48] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-white">Variance</span>
                <span className={`text-[20px] font-bold ${balanced ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${(END_OF_DAY.actualTotal - END_OF_DAY.expectedTotal).toFixed(2)}
                </span>
              </div>
              {balanced && (
                <div className="flex items-center gap-2 mt-2 text-emerald-400 text-[12px]">
                  <CheckCircle size={14} />
                  Register is balanced
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment method breakdown */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <h3 className="text-[15px] font-semibold text-white mb-4">Payment Method Breakdown</h3>
          <div className="space-y-3">
            <BreakdownBar label="Credit Card" amount={END_OF_DAY.totalCredit} total={END_OF_DAY.expectedTotal + END_OF_DAY.totalRefunds} color="bg-blue-500" />
            <BreakdownBar label="Cash" amount={END_OF_DAY.totalCash} total={END_OF_DAY.expectedTotal + END_OF_DAY.totalRefunds} color="bg-emerald-500" />
            <BreakdownBar label="Cheque" amount={END_OF_DAY.totalCheque} total={END_OF_DAY.expectedTotal + END_OF_DAY.totalRefunds} color="bg-amber-500" />
          </div>
        </div>

        {/* Close register */}
        {!closed ? (
          <button
            onClick={() => setClosed(true)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-[16px] font-semibold rounded-2xl transition-all duration-150 active:scale-[0.98] shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <Lock size={20} />
            Close Register
          </button>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center fade-in">
            <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
            <h3 className="text-[17px] font-bold text-emerald-400">Register Closed</h3>
            <p className="text-[13px] text-emerald-400/60 mt-1">
              Closed by {CASHIER.name} at {new Date().toLocaleTimeString()}
            </p>
            <p className="text-[12px] text-[#3a6070] mt-2">End of day report has been generated and sent to the supervisor.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, color, bgColor, negative, count }: {
  icon: React.ReactNode; label: string; value: number; color: string; bgColor: string; negative?: boolean; count?: boolean;
}) {
  return (
    <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center ${color}`}>{icon}</div>
        <span className="text-[11px] text-[#5a8a9a] font-medium">{label}</span>
      </div>
      <div className={`text-[20px] font-bold ${color}`}>
        {count ? value : `${negative ? '-' : ''}$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
      </div>
    </div>
  );
}

function BalanceRow({ label, value, bold, negative }: { label: string; value: number; bold?: boolean; negative?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[13px] ${bold ? 'font-bold text-white' : 'text-[#7ab0c0]'}`}>{label}</span>
      <span className={`${bold ? 'font-bold text-white text-[17px]' : negative ? 'text-red-400 text-[13px]' : 'text-[#c8dce4] text-[13px]'}`}>
        {negative && value < 0 ? '-' : ''}${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
}

function BreakdownBar({ label, amount, total, color }: { label: string; amount: number; total: number; color: string }) {
  const pct = (amount / total) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-[13px] mb-1.5">
        <span className="text-white">{label}</span>
        <span className="text-[#7ab0c0]">
          ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({pct.toFixed(0)}%)
        </span>
      </div>
      <div className="h-2 bg-[#163540] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
