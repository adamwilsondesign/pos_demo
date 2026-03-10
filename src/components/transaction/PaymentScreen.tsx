import { useState } from 'react';
import { CreditCard, Banknote, FileCheck, ArrowLeft } from 'lucide-react';
import type { Payment } from '../../stores/demoData';

interface PaymentScreenProps {
  method: 'credit' | 'cash' | 'cheque';
  total: number;
  remainingBalance: number;
  totalPaid: number;
  onProcessPayment: (payment: Payment) => void;
  onBack: () => void;
  onShowTerminal: () => void;
}

export function PaymentScreen({ method, total: _total, remainingBalance, totalPaid, onProcessPayment, onBack, onShowTerminal }: PaymentScreenProps) {
  const [amount, setAmount] = useState(remainingBalance.toFixed(2));
  const [processing, setProcessing] = useState(false);

  const amountNum = parseFloat(amount) || 0;
  const isPartial = amountNum < remainingBalance && amountNum > 0;

  const handleProcess = () => {
    if (method === 'credit') {
      onShowTerminal();
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      onProcessPayment({
        method,
        amount: amountNum,
        reference: method === 'cheque' ? `CHQ-${Math.floor(Math.random() * 90000 + 10000)}` : undefined,
      });
      setProcessing(false);
    }, 500);
  };

  const quickAmounts = [
    { label: 'Full Amount', value: remainingBalance },
    ...(remainingBalance > 100 ? [{ label: '$100.00', value: 100 }] : []),
    ...(remainingBalance > 500 ? [{ label: '$500.00', value: 500 }] : []),
    ...(remainingBalance > 50 ? [{ label: '$50.00', value: 50 }] : []),
  ];

  const methodConfig = {
    credit: { icon: <CreditCard size={24} />, label: 'Credit / Debit Card', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    cash: { icon: <Banknote size={24} />, label: 'Cash', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    cheque: { icon: <FileCheck size={24} />, label: 'Cheque', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  };

  const cfg = methodConfig[method];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 fade-in bg-[#0d1b21]">
      <div className="w-full max-w-md space-y-5">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-[#5a8a9a] hover:text-white transition-colors">
          <ArrowLeft size={16} />
          Back to payment methods
        </button>

        {/* Method header */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6 text-center">
          <div className={`w-14 h-14 mx-auto rounded-2xl ${cfg.bgColor} flex items-center justify-center mb-3`}>
            <div className={cfg.color}>{cfg.icon}</div>
          </div>
          <h2 className="text-[18px] font-bold text-white">{cfg.label}</h2>

          {totalPaid > 0 && (
            <div className="mt-4 bg-[#0d1b21] rounded-xl p-3">
              <div className="text-[11px] text-[#5a8a9a]">Already Paid</div>
              <div className="text-[16px] font-bold text-emerald-400">${totalPaid.toFixed(2)}</div>
            </div>
          )}
        </div>

        {/* Amount input */}
        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <div className="text-[13px] text-[#7ab0c0] mb-2">Amount to charge</div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-[#5a8a9a]">$</span>
            <input
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-[#0d1b21] border border-[#1a3d48] rounded-xl pl-10 pr-4 py-4 text-[28px] font-bold text-white text-center focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <div className="text-[12px] text-[#5a8a9a] text-center mt-2">
            Remaining balance: ${remainingBalance.toFixed(2)}
          </div>

          {/* Quick amounts */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {quickAmounts.map(q => (
              <button
                key={q.label}
                onClick={() => setAmount(q.value.toFixed(2))}
                className="px-3 py-1.5 bg-[#163540] hover:bg-[#1e4a56] rounded-lg text-[12px] font-medium text-[#7ab0c0] hover:text-white transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {isPartial && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 text-center">
            <p className="text-[13px] text-amber-400 font-semibold">Split Tender — Partial Payment</p>
            <p className="text-[12px] text-amber-400/60 mt-1">
              ${(remainingBalance - amountNum).toFixed(2)} will remain after this payment
            </p>
          </div>
        )}

        {/* Process button */}
        <button
          onClick={handleProcess}
          disabled={processing || amountNum <= 0}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-[16px] font-semibold rounded-2xl transition-all duration-150 active:scale-[0.98] shadow-lg shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {processing ? 'Processing...' : `Charge $${amountNum.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
