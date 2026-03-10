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
    <div className="flex-1 flex flex-col overflow-hidden bg-white text-gray-900">
      {/* Header */}
      <div className="px-8 py-4 border-b border-gray-200 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors active:scale-95">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2 text-[13px] text-gray-400">
          <span className="text-gray-900 font-medium">Cart</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Information</span>
          <span>/</span>
          <span className="text-blue-600 font-semibold">Payment</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Payment methods */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-lg mx-auto space-y-6">
            {/* Express checkout */}
            <div>
              <div className="text-center text-[12px] text-gray-400 uppercase tracking-wider mb-3">Express checkout</div>
              <div className="flex gap-2">
                <button className="flex-1 h-[44px] bg-[#5a31f4] hover:bg-[#4a28d4] rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-white text-[14px] font-bold tracking-tight">Shop Pay</span>
                </button>
                <button className="flex-1 h-[44px] bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-white text-[14px] font-medium">G Pay</span>
                </button>
                <button className="flex-1 h-[44px] bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-white text-[14px] font-medium">Apple Pay</span>
                </button>
              </div>
            </div>

            {/* OR divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-[12px] text-gray-400 uppercase">OR</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Payment method selection */}
            <div>
              <div className="text-[14px] font-semibold text-gray-900 mb-3">Payment method</div>
              <div className="space-y-2">
                <PaymentOption
                  icon={<CreditCard size={20} />}
                  label="Credit / Debit Card"
                  sublabel="Tap, insert, or swipe"
                  onClick={() => onPayment('credit')}
                  primary
                />
                <PaymentOption
                  icon={<Banknote size={20} />}
                  label="Cash"
                  sublabel="Exact or make change"
                  onClick={() => onPayment('cash')}
                />
                <PaymentOption
                  icon={<FileCheck size={20} />}
                  label="Cheque"
                  sublabel="Certified or personal"
                  onClick={() => onPayment('cheque')}
                />
              </div>
            </div>

            {/* Contact info (display only) */}
            <div>
              <div className="text-[14px] font-semibold text-gray-900 mb-3">Contact information</div>
              <input
                type="email"
                placeholder="Email"
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[14px] text-gray-900 placeholder-gray-400 bg-gray-50 focus:outline-none"
              />
            </div>

            <div className="text-center pt-2">
              <p className="text-[12px] text-gray-400">Split tender supported — select multiple methods</p>
            </div>
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="w-[420px] bg-gray-50 border-l border-gray-200 p-8 flex flex-col overflow-y-auto">
          <div className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-4">Order summary</div>

          {/* Items */}
          <div className="space-y-3 mb-6">
            {cart.map(item => {
              const effectivePrice = item.discountAmount ? item.price - item.discountAmount : item.price;
              const lineTotal = effectivePrice * item.quantity;
              const fee = calculateConvenienceFee(item);

              return (
                <div key={item.id} className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-[50px] h-[50px] rounded-lg bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-400 text-[10px] font-medium shrink-0">
                      {item.quantity}x
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-gray-900">{item.name}</div>
                      {item.accountRef && <div className="text-[11px] text-gray-400 font-mono">{item.accountRef}</div>}
                      {item.discountAmount && (
                        <div className="text-[11px] text-green-600">{item.discountLabel} (-${item.discountAmount.toFixed(2)}/ea)</div>
                      )}
                      {fee > 0 && <div className="text-[11px] text-amber-600">Fee: ${fee.toFixed(2)}</div>}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-[13px] font-medium text-gray-900">${lineTotal.toFixed(2)}</div>
                    {item.discountAmount && (
                      <div className="text-[11px] text-gray-400 line-through">${(item.price * item.quantity).toFixed(2)}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">Tax</span>
              <span className="text-gray-900">${tax.toFixed(2)}</span>
            </div>
            {convenienceFee > 0 && (
              <div className="flex justify-between text-[13px]">
                <span className="text-amber-600">Convenience Fee (2%)</span>
                <span className="text-amber-600">${convenienceFee.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 mt-3 pt-3">
            <div className="flex justify-between items-baseline">
              <span className="text-[15px] font-semibold text-gray-900">Total</span>
              <span className="text-[24px] font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentOption({ icon, label, sublabel, onClick, primary }: { icon: React.ReactNode; label: string; sublabel: string; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-150 active:scale-[0.99] ${
        primary
          ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${primary ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
        {icon}
      </div>
      <div className="text-left">
        <div className="text-[14px] font-semibold text-gray-900">{label}</div>
        <div className="text-[12px] text-gray-500">{sublabel}</div>
      </div>
    </button>
  );
}
