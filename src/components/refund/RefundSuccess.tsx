import { CheckCircle, ArrowLeft } from 'lucide-react';

interface RefundSuccessProps {
  refundId: string;
  amount: number;
  itemName: string;
  transactionId: string;
  onBack: () => void;
}

export function RefundSuccess({ refundId, amount, itemName, transactionId, onBack }: RefundSuccessProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 fade-in bg-[#0d1b21]">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="space-y-4 scale-in">
          <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle size={48} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-[28px] font-bold text-emerald-400 tracking-tight">Refund Processed</h1>
            <p className="text-[14px] text-[#5a8a9a] mt-2">Partial refund completed successfully</p>
          </div>
        </div>

        <div className="bg-[#112a33] rounded-2xl border border-[#1a3d48] p-6 text-left space-y-2.5">
          <Row label="Refund ID" value={refundId} mono />
          <Row label="Original Transaction" value={transactionId} mono />
          <Row label="Refunded Item" value={itemName} />
          <div className="border-t border-[#1a3d48] pt-3 mt-3">
            <div className="flex justify-between items-baseline">
              <span className="text-[13px] text-[#7ab0c0]">Refund Amount</span>
              <span className="text-[22px] font-bold text-red-400">-${amount.toFixed(2)}</span>
            </div>
          </div>
          <Row label="Refund Method" value="Original payment method" />
          <Row label="Status" value="Completed" />
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 mx-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-[14px] font-semibold rounded-2xl transition-all duration-150 active:scale-[0.98] shadow-lg shadow-blue-600/20"
        >
          <ArrowLeft size={16} />
          Back to Transaction
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-[#7ab0c0]">{label}</span>
      <span className={`text-white ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
