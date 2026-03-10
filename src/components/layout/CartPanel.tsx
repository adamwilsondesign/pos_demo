import { Trash2, Plus, Minus, ShoppingCart, Tag, MoreHorizontal } from 'lucide-react';
import type { CartItem } from '../../stores/demoData';
import { calculateConvenienceFee } from '../../stores/demoData';

interface CartPanelProps {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  applyDiscount: (id: string, amount: number, label: string) => void;
  subtotal: number;
  tax: number;
  convenienceFee: number;
  total: number;
  onCheckout: () => void;
}

export function CartPanel({
  cart, removeFromCart, updateQuantity, applyDiscount,
  subtotal, tax, convenienceFee, total, onCheckout,
}: CartPanelProps) {
  return (
    <div className="w-[460px] bg-[#0d1b21] border-l border-[#1a3d48] flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#1a3d48]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-white tracking-tight">New order</h2>
          </div>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[#3a6070] hover:text-white hover:bg-[#112a33] transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#1a3d48]">
            <ShoppingCart size={100} strokeWidth={0.8} className="mb-4 opacity-60" />
          </div>
        ) : (
          <div className="divide-y divide-[#1a3d48]">
            {cart.map(item => (
              <CartItemRow
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
                onQuantity={(q) => updateQuantity(item.id, q)}
                onDiscount={() => {
                  if (!item.discountAmount && item.name === 'Garbage Bag Tag') {
                    applyDiscount(item.id, 2.00, 'Municipal Fee Assistance');
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Totals + Checkout */}
      {cart.length > 0 ? (
        <div className="border-t border-[#1a3d48]">
          <div className="px-6 py-4 space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#5a8a9a]">Subtotal</span>
              <span className="text-[#c8dce4]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#5a8a9a]">Tax</span>
              <span className="text-[#c8dce4]">${tax.toFixed(2)}</span>
            </div>
            {convenienceFee > 0 && (
              <div className="flex justify-between text-[13px]">
                <span className="text-amber-400/80">Convenience Fee</span>
                <span className="text-amber-400">${convenienceFee.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="px-6 pb-6">
            <div className="flex justify-between items-baseline mb-5">
              <span className="text-[13px] text-[#5a8a9a] font-medium">Total</span>
              <span className="text-[28px] font-bold text-white tracking-tight">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-4 rounded-2xl text-[16px] transition-all duration-150 active:scale-[0.98] shadow-lg shadow-blue-600/20"
            >
              Checkout
            </button>
          </div>
        </div>
      ) : (
        /* Empty state checkout bar */
        <div className="border-t border-[#1a3d48] px-6 py-5">
          <button
            onClick={onCheckout}
            disabled
            className="w-full border border-[#1a3d48] text-[#3a6070] font-medium py-4 rounded-2xl text-[16px] flex items-center justify-between px-5"
          >
            <span>Checkout</span>
            <span>$0.00</span>
          </button>
        </div>
      )}
    </div>
  );
}

function CartItemRow({
  item, onRemove, onQuantity, onDiscount,
}: {
  item: CartItem;
  onRemove: () => void;
  onQuantity: (q: number) => void;
  onDiscount: () => void;
}) {
  const effectivePrice = item.discountAmount ? item.price - item.discountAmount : item.price;
  const lineTotal = effectivePrice * item.quantity;
  const fee = calculateConvenienceFee(item);

  return (
    <div className="px-6 py-4 fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-white leading-tight">{item.name}</div>
          {item.accountRef && (
            <div className="text-[11px] text-[#3a6070] mt-0.5 font-mono">{item.accountRef}</div>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-[#3a6070]">{item.taxLabel}</span>
            {item.category === 'Prepared Food' && (
              <span className="text-[10px] text-amber-400/60">
                {item.price < 4 ? '(<$4 GST)' : '(≥$4 HST)'}
              </span>
            )}
            {item.sourceSystem && (
              <span className="text-[10px] bg-[#112a33] px-1.5 py-0.5 rounded text-[#5a8a9a]">
                {item.sourceSystem}
              </span>
            )}
          </div>
          {item.discountAmount && (
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400">
              <Tag size={10} />
              <span>{item.discountLabel} (-${item.discountAmount.toFixed(2)})</span>
            </div>
          )}
          {fee > 0 && (
            <div className="text-[11px] text-amber-400/80 mt-0.5">
              +${fee.toFixed(2)} conv. fee
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-[15px] font-bold text-white">${lineTotal.toFixed(2)}</div>
          {item.discountAmount && (
            <div className="text-[11px] text-[#3a6070] line-through">${(item.price * item.quantity).toFixed(2)}</div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1">
          <button onClick={() => onQuantity(item.quantity - 1)} className="w-8 h-8 rounded-lg bg-[#112a33] hover:bg-[#163540] flex items-center justify-center text-[#5a8a9a] transition-colors active:scale-95">
            <Minus size={14} />
          </button>
          <span className="w-9 text-center text-[14px] font-semibold text-white">{item.quantity}</span>
          <button onClick={() => onQuantity(item.quantity + 1)} className="w-8 h-8 rounded-lg bg-[#112a33] hover:bg-[#163540] flex items-center justify-center text-[#5a8a9a] transition-colors active:scale-95">
            <Plus size={14} />
          </button>
        </div>
        <div className="flex items-center gap-1">
          {item.name === 'Garbage Bag Tag' && !item.discountAmount && (
            <button onClick={onDiscount} className="text-[11px] text-blue-400 hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-[#112a33] font-medium transition-colors">
              Discount
            </button>
          )}
          <button onClick={onRemove} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#3a6070] hover:text-red-400 hover:bg-[#112a33] transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
