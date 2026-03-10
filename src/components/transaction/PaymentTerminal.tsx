import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      {/* Close button */}
      {stage === 'waiting' && (
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      )}

      <div className="text-center max-w-sm space-y-8">
        {/* Waiting stage — concentric rings + NFC icon */}
        {stage === 'waiting' && (
          <div className="space-y-8 fade-in">
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              {/* Concentric blue rings */}
              <div className="absolute inset-0 rounded-full border-2 border-blue-100 terminal-ring-1" />
              <div className="absolute inset-4 rounded-full border-2 border-blue-200 terminal-ring-2" />
              <div className="absolute inset-8 rounded-full border-2 border-blue-300 terminal-ring-3" />
              <div className="absolute inset-12 rounded-full border-2 border-blue-400/60 terminal-ring-4" />
              {/* NFC / contactless icon */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
                  <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
                  <path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" />
                  <path d="M16.37 2a20.16 20.16 0 0 1 0 20" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[13px] text-gray-400 uppercase tracking-wider">Total</div>
              <div className="text-[42px] font-bold text-gray-900 tracking-tight">${amount.toFixed(2)}</div>
              <p className="text-[16px] text-gray-500">Tap, insert, or swipe to pay</p>
            </div>
          </div>
        )}

        {/* Processing stage */}
        {stage === 'processing' && (
          <div className="space-y-6 fade-in">
            <div className="w-48 h-48 mx-auto rounded-full bg-gray-50 flex items-center justify-center">
              <div className="w-16 h-16 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="space-y-2">
              <div className="text-[13px] text-gray-400 uppercase tracking-wider">Total</div>
              <div className="text-[42px] font-bold text-gray-900 tracking-tight">${amount.toFixed(2)}</div>
              <p className="text-[16px] text-blue-500 font-medium">Processing payment...</p>
            </div>
          </div>
        )}

        {/* Approved stage */}
        {stage === 'approved' && (
          <div className="space-y-6 scale-in">
            <div className="w-48 h-48 mx-auto rounded-full bg-green-50 flex items-center justify-center">
              <svg className="w-20 h-20 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="text-[42px] font-bold text-gray-900 tracking-tight">${amount.toFixed(2)}</div>
              <p className="text-[18px] text-green-500 font-semibold">Approved</p>
              <p className="text-[14px] text-gray-400">Visa ending in 4242</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
