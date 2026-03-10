import { ArrowLeft, Printer, RotateCcw, Clock, CreditCard } from 'lucide-react';
import { Badge } from '../shared/Badge';
import type { Transaction } from '../../stores/demoData';
import { CASHIER, calculateConvenienceFee } from '../../stores/demoData';

interface TransactionDetailProps {
  transaction: Transaction | null;
  onBack: () => void;
  onRefund: () => void;
}

export function TransactionDetail({ transaction, onBack, onRefund }: TransactionDetailProps) {
  if (!transaction) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#3a6070] bg-[#0d1b21]">
        <p className="text-[14px]">Complete a transaction in the Transaction flow first to view details here.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 fade-in bg-[#0d1b21]">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#163540] text-[#5a8a9a] hover:text-white transition-colors active:scale-95">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-white font-mono tracking-tight">{transaction.id}</h1>
              <p className="text-[13px] text-[#5a8a9a]">
                {new Date(transaction.date).toLocaleString()} — Receipt #{transaction.receiptNumber}
              </p>
            </div>
          </div>
          <Badge variant={transaction.status === 'completed' ? 'green' : 'amber'}>
            {transaction.status === 'completed' ? 'Completed' : 'Partial Refund'}
          </Badge>
        </div>

        {/* Line items */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <div className="text-[11px] font-semibold text-[#5a8a9a] uppercase tracking-widest mb-4">Line Items</div>
          <div className="space-y-2">
            {transaction.items.map((item, i) => {
              const ep = item.discountAmount ? item.price - item.discountAmount : item.price;
              const lineTax = ep * item.quantity * item.taxRate;
              const fee = calculateConvenienceFee(item);
              const refund = transaction.refunds?.find(r => r.itemId === item.id);

              return (
                <div key={i} className={`flex items-start justify-between p-3 bg-[#0d1b21] rounded-xl ${refund ? 'opacity-50' : ''}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-white">{item.name}</span>
                      {refund && <Badge variant="red">Refunded</Badge>}
                    </div>
                    {item.accountRef && <div className="text-[11px] text-[#5a8a9a] font-mono mt-0.5">{item.accountRef}</div>}
                    {item.sourceSystem && <div className="text-[10px] text-[#3a6070] mt-0.5">Source: {item.sourceSystem}</div>}
                    {item.discountAmount && <div className="text-[11px] text-emerald-400 mt-0.5">{item.discountLabel} (-${item.discountAmount.toFixed(2)})</div>}
                    <div className="text-[11px] text-[#5a8a9a] mt-1">
                      {item.quantity} x ${ep.toFixed(2)} — {item.taxLabel}: ${lineTax.toFixed(2)}
                      {fee > 0 && <span className="text-amber-400/80"> — Fee: ${fee.toFixed(2)}</span>}
                    </div>
                    {refund && <div className="text-[11px] text-red-400 mt-1">Refund: {refund.reason} — {refund.refundId}</div>}
                  </div>
                  <div className="text-[14px] font-bold text-white">
                    ${(ep * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <div className="text-[11px] font-semibold text-[#5a8a9a] uppercase tracking-widest mb-3">Transaction Totals</div>
          <div className="space-y-2">
            <Row label="Subtotal" value={transaction.subtotal} />
            <Row label="Tax" value={transaction.totalTax} />
            {transaction.totalConvenienceFee > 0 && <Row label="Convenience Fee (2%)" value={transaction.totalConvenienceFee} amber />}
            <div className="border-t border-[#1a3d48] pt-3 mt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] text-[#7ab0c0] font-medium">Total</span>
                <span className="text-[22px] font-bold text-white">${transaction.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <div className="text-[11px] font-semibold text-[#5a8a9a] uppercase tracking-widest mb-3 flex items-center gap-2">
            <CreditCard size={14} />
            Payment Methods
          </div>
          <div className="space-y-2">
            {transaction.payments.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#0d1b21] rounded-xl">
                <div>
                  <span className="text-[13px] font-medium text-white capitalize">{p.method}</span>
                  {p.last4 && <span className="text-[13px] text-[#5a8a9a] ml-2">****{p.last4}</span>}
                  {p.reference && <span className="text-[11px] text-[#3a6070] ml-2">{p.reference}</span>}
                </div>
                <span className="text-[14px] font-bold text-white">${p.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <div className="text-[11px] font-semibold text-[#5a8a9a] uppercase tracking-widest mb-3 flex items-center gap-2">
            <Clock size={14} />
            Audit Trail
          </div>
          <div className="space-y-0 text-[12px]">
            <AuditRow time={new Date(transaction.date).toLocaleTimeString()} action="Transaction created" user={CASHIER.name} />
            {transaction.payments.map((p, i) => (
              <AuditRow key={i} time={new Date(transaction.date).toLocaleTimeString()} action={`${p.method} payment $${p.amount.toFixed(2)}`} user={CASHIER.name} />
            ))}
            <AuditRow time={new Date(transaction.date).toLocaleTimeString()} action="Transaction completed" user={CASHIER.name} />
            {transaction.refunds?.map((r, i) => (
              <AuditRow key={i} time={r.date ? new Date(r.date).toLocaleTimeString() : ''} action={`Refund $${r.amount.toFixed(2)} — ${r.reason}`} user={CASHIER.name} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#112a33] border border-[#1a3d48] rounded-xl text-[13px] font-medium text-white hover:bg-[#163540] hover:border-[#245560] transition-all active:scale-[0.98]">
            <Printer size={14} />
            Reprint Receipt
          </button>
          <button
            onClick={onRefund}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-[13px] font-medium text-red-400 hover:bg-red-500/20 transition-all active:scale-[0.98]"
          >
            <RotateCcw size={14} />
            Process Refund
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, amber }: { label: string; value: number; amber?: boolean }) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className={amber ? 'text-amber-400/80' : 'text-[#7ab0c0]'}>{label}</span>
      <span className={amber ? 'text-amber-400' : 'text-[#c8dce4]'}>${value.toFixed(2)}</span>
    </div>
  );
}

function AuditRow({ time, action, user }: { time: string; action: string; user: string }) {
  return (
    <div className="flex items-center gap-4 py-2 border-b border-[#1a3d48] last:border-0">
      <span className="text-[#3a6070] w-20 shrink-0">{time}</span>
      <span className="text-[#c8dce4] flex-1">{action}</span>
      <span className="text-[#5a8a9a]">{user}</span>
    </div>
  );
}
