import { CheckCircle, Printer, Mail, RotateCcw } from 'lucide-react';
import type { Transaction } from '../../stores/demoData';
import { CUSTOMER } from '../../stores/demoData';

interface PaymentSuccessProps {
  transaction: Transaction;
  onNewTransaction: () => void;
  onReceipt: () => void;
}

export function PaymentSuccess({ transaction, onNewTransaction, onReceipt }: PaymentSuccessProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 fade-in bg-[#0d1b21]">
      <div className="w-full max-w-lg text-center space-y-6">
        {/* Success icon */}
        <div className="space-y-4 scale-in">
          <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle size={48} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-[28px] font-bold text-emerald-400 tracking-tight">Payment Complete</h1>
            <p className="text-[14px] text-[#5a8a9a] mt-2">Transaction processed successfully</p>
          </div>
        </div>

        {/* Transaction summary */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6 text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-[#5a8a9a]">Transaction ID</span>
            <span className="text-[13px] font-mono text-white">{transaction.id}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] text-[#5a8a9a]">Receipt #</span>
            <span className="text-[13px] font-mono text-white">{transaction.receiptNumber}</span>
          </div>
          <div className="border-t border-[#1a3d48] pt-3 space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#7ab0c0]">Items</span>
              <span className="text-[#c8dce4]">{transaction.items.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#7ab0c0]">Subtotal</span>
              <span className="text-[#c8dce4]">${transaction.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#7ab0c0]">Tax</span>
              <span className="text-[#c8dce4]">${transaction.totalTax.toFixed(2)}</span>
            </div>
            {transaction.totalConvenienceFee > 0 && (
              <div className="flex justify-between text-[13px]">
                <span className="text-amber-400/80">Convenience Fee</span>
                <span className="text-amber-400">${transaction.totalConvenienceFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline border-t border-[#1a3d48] pt-3 mt-3">
              <span className="text-[13px] text-[#7ab0c0] font-medium">Total Paid</span>
              <span className="text-[22px] font-bold text-white">${transaction.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="mt-4 space-y-1.5">
            {transaction.payments.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-[12px] bg-[#0d1b21] rounded-lg px-3 py-2.5">
                <span className="text-[#7ab0c0] capitalize">{p.method}{p.last4 ? ` ****${p.last4}` : ''}</span>
                <span className="text-white font-medium">${p.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onReceipt}
            className="flex items-center gap-2 px-5 py-3 bg-[#112a33] border border-[#1a3d48] rounded-xl text-[13px] font-medium text-white hover:bg-[#163540] hover:border-[#245560] transition-all active:scale-[0.98]"
          >
            <Printer size={15} />
            Print Receipt
          </button>
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-5 py-3 bg-[#112a33] border border-[#1a3d48] rounded-xl text-[13px] font-medium text-white hover:bg-[#163540] hover:border-[#245560] transition-all active:scale-[0.98]"
          >
            <Mail size={15} />
            Email to {CUSTOMER.email}
          </button>
        </div>

        <button
          onClick={onNewTransaction}
          className="flex items-center gap-2 mx-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-[14px] font-semibold rounded-2xl transition-all duration-150 active:scale-[0.98] shadow-lg shadow-blue-600/20"
        >
          <RotateCcw size={16} />
          New Transaction
        </button>
      </div>
    </div>
  );
}
