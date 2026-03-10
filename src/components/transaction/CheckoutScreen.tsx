import { ArrowLeft, CreditCard, Banknote, FileCheck } from 'lucide-react';
import type { CartItem } from '../../stores/demoData';
import { calculateConvenienceFee } from '../../stores/demoData';

interface CheckoutScreenProps {
  cart: CartItem[];
  subtotal: number;
  tax: number;
  convenienceFee: number;
  total: number;
  onBack: () => void;
  onPayment: (method: 'credit' | 'cash' | 'cheque') => void;
}

export function CheckoutScreen({ cart, subtotal, tax, convenienceFee, total, onBack, onPayment }: CheckoutScreenProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden fade-in bg-[#0d1b21]">
      {/* Header */}
      <div className="px-8 py-5 border-b border-[#1a3d48] flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#163540] text-[#5a8a9a] hover:text-white transition-colors active:scale-95">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-[18px] font-semibold text-white tracking-tight">Checkout</h1>
          <p className="text-[12px] text-[#5a8a9a]">{cart.length} item{cart.length !== 1 ? 's' : ''} — Review & select payment</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Item review */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="text-[11px] font-semibold text-[#5a8a9a] uppercase tracking-widest mb-4">Order Items</div>
          <div className="space-y-2">
            {cart.map(item => {
              const effectivePrice = item.discountAmount ? item.price - item.discountAmount : item.price;
              const lineTotal = effectivePrice * item.quantity;
              const lineTax = effectivePrice * item.quantity * item.taxRate;
              const fee = calculateConvenienceFee(item);

              return (
                <div key={item.id} className="bg-[#112a33] rounded-xl p-5 flex items-start justify-between border border-[#1a3d48]">
                  <div>
                    <div className="text-[14px] font-semibold text-white">{item.name}</div>
                    {item.accountRef && <div className="text-[11px] text-[#5a8a9a] font-mono mt-0.5">{item.accountRef}</div>}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[12px] text-[#7ab0c0]">Qty: {item.quantity}</span>
                      <span className="text-[12px] text-[#5a8a9a]">@ ${effectivePrice.toFixed(2)}</span>
                    </div>
                    {item.discountAmount && (
                      <div className="text-[11px] text-emerald-400 mt-1">{item.discountLabel} (-${item.discountAmount.toFixed(2)}/ea)</div>
                    )}
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#5a8a9a]">
                      <span>{item.taxLabel}: ${lineTax.toFixed(2)}</span>
                      {fee > 0 && <span className="text-amber-400/80">Fee: ${fee.toFixed(2)}</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[15px] font-bold text-white">${lineTotal.toFixed(2)}</div>
                    {item.discountAmount && (
                      <div className="text-[11px] text-[#3a6070] line-through">${(item.price * item.quantity).toFixed(2)}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment selection */}
        <div className="w-[420px] bg-[#091419] border-l border-[#1a3d48] p-8 flex flex-col">
          <div className="text-[11px] font-semibold text-[#5a8a9a] uppercase tracking-widest mb-4">Order Summary</div>
          <div className="space-y-2.5 mb-6">
            <SummaryRow label="Subtotal" value={subtotal} />
            <SummaryRow label="Tax" value={tax} />
            {convenienceFee > 0 && <SummaryRow label="Convenience Fee (2%)" value={convenienceFee} amber />}
            <div className="border-t border-[#1a3d48] pt-3 mt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[13px] text-[#7ab0c0] font-medium">Total</span>
                <span className="text-[28px] font-bold text-white tracking-tight">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-[#5a8a9a] uppercase tracking-widest mb-3">Payment Method</div>
          <div className="space-y-2.5 flex-1">
            <PaymentButton icon={<CreditCard size={20} />} label="Credit / Debit Card" sublabel="Tap, insert, or swipe" onClick={() => onPayment('credit')} primary />
            <PaymentButton icon={<Banknote size={20} />} label="Cash" sublabel="Exact or make change" onClick={() => onPayment('cash')} />
            <PaymentButton icon={<FileCheck size={20} />} label="Cheque" sublabel="Certified or personal" onClick={() => onPayment('cheque')} />
          </div>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-[#3a6070]">Split tender supported — select multiple methods</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, amber }: { label: string; value: number; amber?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={`text-[13px] ${amber ? 'text-amber-400/80' : 'text-[#7ab0c0]'}`}>{label}</span>
      <span className={`text-[13px] ${amber ? 'text-amber-400' : 'text-[#c8dce4]'}`}>${value.toFixed(2)}</span>
    </div>
  );
}

function PaymentButton({ icon, label, sublabel, onClick, primary }: { icon: React.ReactNode; label: string; sublabel: string; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-150 active:scale-[0.98] ${
        primary
          ? 'bg-blue-600/10 border-blue-500/30 text-white hover:bg-blue-600/15 hover:border-blue-500/50'
          : 'bg-[#112a33] border-[#1a3d48] text-white hover:bg-[#163540] hover:border-[#245560]'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${primary ? 'bg-blue-600/20 text-blue-400' : 'bg-[#163540] text-[#7ab0c0]'}`}>
        {icon}
      </div>
      <div className="text-left">
        <div className="text-[14px] font-semibold">{label}</div>
        <div className="text-[12px] text-[#5a8a9a]">{sublabel}</div>
      </div>
    </button>
  );
}
