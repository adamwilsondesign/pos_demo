import { Search, ChevronRight, CheckCircle } from 'lucide-react';
import { Badge } from '../shared/Badge';
import type { Transaction } from '../../stores/demoData';
import { CASHIER } from '../../stores/demoData';

interface TransactionHistoryProps {
  completedTransaction: Transaction | null;
  onViewDetail: () => void;
}

const mockHistory = [
  { id: 'TXN-ABC123', time: '1:42 PM', items: 3, total: 132.50, method: 'Credit ****7891', status: 'completed' as const },
  { id: 'TXN-DEF456', time: '11:15 AM', items: 1, total: 75.00, method: 'Cash', status: 'completed' as const },
  { id: 'TXN-GHI789', time: '10:30 AM', items: 2, total: 49.00, method: 'Credit ****2234', status: 'completed' as const },
  { id: 'TXN-JKL012', time: '9:55 AM', items: 1, total: 900.00, method: 'Split — Credit/Cash', status: 'completed' as const },
];

export function TransactionHistory({ completedTransaction, onViewDetail }: TransactionHistoryProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 fade-in bg-[#0d1b21]">
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Transaction History</h1>
          <p className="text-[13px] text-[#5a8a9a] mt-1">Today's transactions — {CASHIER.name} — {CASHIER.location}</p>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3a6070]" />
          <input
            type="text"
            placeholder="Search by transaction ID, receipt number, or customer..."
            className="w-full bg-[#112a33] border border-[#1a3d48] rounded-xl pl-11 pr-4 py-3 text-[13px] text-white placeholder-[#3a6070] focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        {completedTransaction && (
          <div>
            <div className="text-[11px] font-semibold text-[#5a8a9a] uppercase tracking-widest mb-2">Current Demo Transaction</div>
            <button
              onClick={onViewDetail}
              className="w-full bg-[#112a33] hover:bg-[#163540] border border-blue-500/20 hover:border-blue-500/40 rounded-2xl p-4 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                    <CheckCircle size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-white font-mono">{completedTransaction.id}</span>
                      <Badge variant="green">Completed</Badge>
                      <Badge variant="blue">Demo</Badge>
                    </div>
                    <div className="text-[12px] text-[#5a8a9a] mt-0.5">
                      {completedTransaction.items.length} items — {completedTransaction.payments.map(p => `${p.method}${p.last4 ? ` ****${p.last4}` : ''}`).join(', ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[17px] font-bold text-white">${completedTransaction.total.toFixed(2)}</span>
                  <ChevronRight size={18} className="text-[#3a6070] group-hover:text-white transition-colors" />
                </div>
              </div>
            </button>
          </div>
        )}

        <div>
          <div className="text-[11px] font-semibold text-[#5a8a9a] uppercase tracking-widest mb-2">Earlier Today</div>
          <div className="space-y-2">
            {mockHistory.map(txn => (
              <div
                key={txn.id}
                className="bg-[#112a33] hover:bg-[#163540] border border-[#1a3d48] hover:border-[#245560] rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0d1b21] flex items-center justify-center">
                    <CheckCircle size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-white font-mono">{txn.id}</span>
                      <Badge variant="green">Completed</Badge>
                    </div>
                    <div className="text-[12px] text-[#5a8a9a] mt-0.5">{txn.time} — {txn.items} item{txn.items !== 1 ? 's' : ''} — {txn.method}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-semibold text-white">${txn.total.toFixed(2)}</span>
                  <ChevronRight size={16} className="text-[#3a6070]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
