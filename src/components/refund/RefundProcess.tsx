import { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Transaction } from '../../stores/demoData';

interface RefundProcessProps {
  transaction: Transaction | null;
  onBack: () => void;
  onComplete: (itemId: string, amount: number, reason: string) => void;
}

export function RefundProcess({ transaction, onBack, onComplete }: RefundProcessProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [reason, setReason] = useState('Customer requested cancellation');
  const [processing, setProcessing] = useState(false);

  if (!transaction) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#3a6070] bg-[#0d1b21]">
        <p className="text-[14px]">No transaction selected for refund.</p>
      </div>
    );
  }

  const refundableItems = transaction.items.filter(i => !transaction.refunds?.find(r => r.itemId === i.id));

  const selectedItemObj = refundableItems.find(i => i.id === selectedItem);
  const refundAmount = selectedItemObj
    ? (selectedItemObj.discountAmount ? selectedItemObj.price - selectedItemObj.discountAmount : selectedItemObj.price) * selectedItemObj.quantity
    : 0;

  const handleRefund = () => {
    if (!selectedItem) return;
    setProcessing(true);
    setTimeout(() => {
      onComplete(selectedItem, refundAmount, reason);
      setProcessing(false);
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 fade-in bg-[#0d1b21]">
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#163540] text-[#5a8a9a] hover:text-white transition-colors active:scale-95">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[20px] font-bold text-white tracking-tight">Process Refund</h1>
            <p className="text-[13px] text-[#5a8a9a]">Transaction {transaction.id}</p>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-amber-400">Partial Refund</p>
            <p className="text-[12px] text-amber-400/60 mt-1">
              Select the item(s) to refund. The refund will be processed to the original payment method.
              Supervisor approval may be required for refunds exceeding $50.
            </p>
          </div>
        </div>

        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6">
          <div className="text-[11px] font-semibold text-[#5a8a9a] uppercase tracking-widest mb-3">Select Item to Refund</div>
          <div className="space-y-2">
            {refundableItems.map(item => {
              const ep = item.discountAmount ? item.price - item.discountAmount : item.price;
              const isSelected = selectedItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all active:scale-[0.99] ${
                    isSelected
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-[#0d1b21] border-[#1a3d48] hover:border-[#245560]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-red-400 bg-red-400' : 'border-[#3a6070]'
                      }`}>
                        {isSelected && <CheckCircle size={12} className="text-white" />}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-white">{item.name}</div>
                        {item.accountRef && <div className="text-[11px] text-[#5a8a9a] font-mono">{item.accountRef}</div>}
                      </div>
                    </div>
                    <span className="text-[14px] font-bold text-white">${(ep * item.quantity).toFixed(2)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedItem && (
          <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6 fade-in">
            <div className="text-[11px] font-semibold text-[#5a8a9a] uppercase tracking-widest mb-3">Refund Reason</div>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-[#0d1b21] border border-[#1a3d48] rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none focus:border-blue-500/50 transition-colors"
            >
              <option>Customer requested cancellation</option>
              <option>Service not rendered</option>
              <option>Duplicate payment</option>
              <option>Pricing error</option>
              <option>Other</option>
            </select>
          </div>
        )}

        {selectedItem && (
          <div className="bg-[#112a33] rounded-2xl border border-red-500/20 p-6 fade-in">
            <div className="text-[11px] font-semibold text-red-400 uppercase tracking-widest mb-3">Refund Summary</div>
            <div className="space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#7ab0c0]">Item</span>
                <span className="text-white">{selectedItemObj?.name}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] text-[#7ab0c0]">Refund Amount</span>
                <span className="text-[20px] font-bold text-red-400">${refundAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#7ab0c0]">Reason</span>
                <span className="text-white">{reason}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#7ab0c0]">Refund To</span>
                <span className="text-white">Original payment method</span>
              </div>
            </div>
          </div>
        )}

        {selectedItem && (
          <button
            onClick={handleRefund}
            disabled={processing}
            className="w-full py-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-[16px] font-semibold rounded-2xl transition-all duration-150 active:scale-[0.98] disabled:opacity-40"
          >
            {processing ? 'Processing Refund...' : `Refund $${refundAmount.toFixed(2)}`}
          </button>
        )}
      </div>
    </div>
  );
}
