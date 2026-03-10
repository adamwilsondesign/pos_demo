import { useState, useEffect } from 'react';
import { CreditCard, Wifi, Smartphone } from 'lucide-react';
import type { Payment } from '../../stores/demoData';

interface PaymentTerminalProps {
  amount: number;
  onComplete: (payment: Payment) => void;
  onCancel: () => void;
}

export function PaymentTerminal({ amount, onComplete, onCancel }: PaymentTerminalProps) {
  const [stage, setStage] = useState<'waiting' | 'processing' | 'approved'>('waiting');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('processing'), 3000);
    const t2 = setTimeout(() => setStage('approved'), 4500);
    const t3 = setTimeout(() => {
      onComplete({
        method: 'credit',
        amount,
        reference: `AUTH-${Math.floor(Math.random() * 900000 + 100000)}`,
        last4: '4242',
      });
    }, 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [amount, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#060e12] flex items-center justify-center">
      <div className="text-center max-w-sm space-y-8">
        {/* Amount */}
        <div>
          <div className="text-[48px] font-bold text-white tracking-tight">${amount.toFixed(2)}</div>
          <div className="text-[13px] text-[#5a8a9a] mt-1">Kingston Service Counter</div>
        </div>

        {/* Terminal visual */}
        {stage === 'waiting' && (
          <div className="space-y-6 fade-in">
            <div className="w-36 h-36 mx-auto rounded-3xl bg-[#112a33] border-2 border-[#1a3d48] flex items-center justify-center relative pulse-ring">
              <Wifi size={52} className="text-blue-400 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Smartphone size={13} className="text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[20px] font-semibold text-white">Tap, Insert, or Swipe</p>
              <p className="text-[14px] text-[#5a8a9a]">Present payment card on the terminal</p>
            </div>
            <div className="flex justify-center gap-8 text-[#3a6070]">
              <div className="flex flex-col items-center gap-1.5">
                <Wifi size={20} />
                <span className="text-[10px] font-medium">Tap</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <CreditCard size={20} />
                <span className="text-[10px] font-medium">Insert</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <CreditCard size={20} className="rotate-90" />
                <span className="text-[10px] font-medium">Swipe</span>
              </div>
            </div>
          </div>
        )}

        {stage === 'processing' && (
          <div className="space-y-5 fade-in">
            <div className="w-36 h-36 mx-auto rounded-3xl bg-[#112a33] border-2 border-blue-500/50 flex items-center justify-center">
              <div className="w-14 h-14 border-[3px] border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-[18px] font-semibold text-blue-400">Processing payment...</p>
          </div>
        )}

        {stage === 'approved' && (
          <div className="space-y-5 scale-in">
            <div className="w-36 h-36 mx-auto rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/50 flex items-center justify-center">
              <svg className="w-16 h-16 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[18px] font-semibold text-emerald-400">Approved</p>
            <p className="text-[14px] text-[#5a8a9a]">Visa ending in 4242</p>
          </div>
        )}

        {/* Cancel */}
        {stage === 'waiting' && (
          <button
            onClick={onCancel}
            className="text-[13px] text-[#3a6070] hover:text-[#7ab0c0] transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
