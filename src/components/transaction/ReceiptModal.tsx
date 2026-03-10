import { Printer, Mail, X } from 'lucide-react';
import type { Transaction } from '../../stores/demoData';
import { CASHIER, CUSTOMER } from '../../stores/demoData';

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function ReceiptModal({ open, onClose, transaction }: ReceiptModalProps) {
  if (!open || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[400px] max-h-[85vh] flex flex-col slide-up" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
          <h3 className="text-[14px] font-semibold text-gray-900">Receipt Preview</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Receipt */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] text-gray-800 leading-relaxed">
          <div className="text-center mb-4">
            <div className="text-[15px] font-bold">City of Kingston</div>
            <div className="text-gray-500 text-[10px]">Kingston Service Counter</div>
            <div className="text-gray-500 text-[10px]">{new Date(transaction.date).toLocaleString()}</div>
          </div>

          <div className="border-t border-dashed border-gray-300 my-3" />

          <div className="text-gray-500 mb-0.5 text-[10px]">Receipt #{transaction.receiptNumber}</div>
          <div className="text-gray-500 mb-3 text-[10px]">Cashier: {CASHIER.name}</div>

          <div className="border-t border-dashed border-gray-300 my-3" />

          {transaction.items.map((item, i) => {
            const ep = item.discountAmount ? item.price - item.discountAmount : item.price;
            return (
              <div key={i} className="flex justify-between mb-1.5">
                <div>
                  <div className="font-medium">{item.name}</div>
                  {item.accountRef && <div className="text-gray-400 text-[9px]">{item.accountRef}</div>}
                  {item.discountAmount && <div className="text-green-600 text-[9px]">Discount: -${item.discountAmount.toFixed(2)}</div>}
                  <div className="text-gray-400 text-[10px]">{item.quantity} x ${ep.toFixed(2)}</div>
                </div>
                <div className="text-right font-medium">${(ep * item.quantity).toFixed(2)}</div>
              </div>
            );
          })}

          <div className="border-t border-dashed border-gray-300 my-3" />

          <div className="flex justify-between mb-1">
            <span>Subtotal</span>
            <span>${transaction.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Tax</span>
            <span>${transaction.totalTax.toFixed(2)}</span>
          </div>
          {transaction.totalConvenienceFee > 0 && (
            <div className="flex justify-between mb-1">
              <span>Convenience Fee</span>
              <span>${transaction.totalConvenienceFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-[13px] mt-2">
            <span>TOTAL</span>
            <span>${transaction.total.toFixed(2)}</span>
          </div>

          <div className="border-t border-dashed border-gray-300 my-3" />

          <div className="text-gray-500 mb-1 text-[10px]">PAYMENT</div>
          {transaction.payments.map((p, i) => (
            <div key={i} className="flex justify-between mb-0.5">
              <span className="capitalize">{p.method}{p.last4 ? ` ****${p.last4}` : ''}{p.reference ? ` ${p.reference}` : ''}</span>
              <span>${p.amount.toFixed(2)}</span>
            </div>
          ))}

          <div className="border-t border-dashed border-gray-300 my-3" />

          <div className="text-center text-gray-400 text-[10px]">
            <div>Transaction {transaction.id}</div>
            <div className="mt-2">Customer: {CUSTOMER.name}</div>
            <div>Email: {CUSTOMER.email}</div>
            <div className="mt-2">Thank you!</div>
            <div>cityofkingston.ca</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 border-t border-gray-200">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-[13px] font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all">
            <Printer size={14} />
            Print
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-800 rounded-xl text-[13px] font-semibold hover:bg-gray-200 active:scale-[0.98] transition-all">
            <Mail size={14} />
            Email
          </button>
        </div>
      </div>
    </div>
  );
}
