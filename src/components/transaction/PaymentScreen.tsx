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
    credit: { icon: <CreditCard size={24} />, label: 'Credit / Debit Card', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    cash: { icon: <Banknote size={24} />, label: 'Cash', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    cheque: { icon: <FileCheck size={24} />, label: 'Cheque', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  };

  const cfg = methodConfig[method];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 fade-in bg-white">
      <div className="w-full max-w-md space-y-5">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} />
          Back to payment methods
        </button>

        {/* Method header */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
          <div className={`w-14 h-14 mx-auto rounded-2xl ${cfg.bgColor} flex items-center justify-center mb-3`}>
            <div className={cfg.color}>{cfg.icon}</div>
          </div>
          <h2 className="text-[18px] font-bold text-gray-900">{cfg.label}</h2>

          {totalPaid > 0 && (
            <div className="mt-4 bg-white rounded-xl p-3 border border-gray-200">
              <div className="text-[11px] text-gray-400">Already Paid</div>
              <div className="text-[16px] font-bold text-emerald-600">${totalPaid.toFixed(2)}</div>
            </div>
          )}
        </div>

        {/* Amount input */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <div className="text-[13px] text-gray-500 mb-2">Amount to charge</div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">$</span>
            <input
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-4 text-[28px] font-bold text-gray-900 text-center focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="text-[12px] text-gray-400 text-center mt-2">
            Remaining balance: ${remainingBalance.toFixed(2)}
          </div>

          {/* Quick amounts */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {quickAmounts.map(q => (
              <button
                key={q.label}
                onClick={() => setAmount(q.value.toFixed(2))}
                className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-[12px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {isPartial && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-center">
            <p className="text-[13px] text-amber-700 font-semibold">Split Tender — Partial Payment</p>
            <p className="text-[12px] text-amber-600/70 mt-1">
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
