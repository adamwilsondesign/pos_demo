import { Modal } from '../shared/Modal';
import type { CartItem } from '../../stores/demoData';
import { STATIC_PRODUCTS } from '../../stores/demoData';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
}

export function ProductModal({ open, onClose, addToCart }: ProductModalProps) {
  const handleAdd = (p: typeof STATIC_PRODUCTS[0]) => {
    addToCart({
      name: p.name,
      price: p.price,
      category: p.category,
      taxRate: p.taxRate,
      taxLabel: p.taxLabel,
    });
    onClose();
  };

  const categories = [...new Set(STATIC_PRODUCTS.map(p => p.category))];

  return (
    <Modal open={open} onClose={onClose} title="Products" wide>
      <div className="space-y-5">
        {categories.map(cat => (
          <div key={cat}>
            <div className="text-[11px] font-semibold text-[#5a8a9a] uppercase tracking-widest mb-2.5">{cat}</div>
            <div className="grid grid-cols-3 gap-2">
              {STATIC_PRODUCTS.filter(p => p.category === cat).map(p => (
                <button
                  key={p.id}
                  onClick={() => handleAdd(p)}
                  className="bg-[#0d1b21] border border-[#1a3d48] rounded-xl p-4 text-left hover:border-blue-500/30 hover:bg-[#151820] transition-all duration-150 active:scale-[0.97]"
                >
                  <div className="text-[13px] font-semibold text-white">{p.name}</div>
                  <div className="text-[16px] font-bold text-white mt-1">${p.price.toFixed(2)}</div>
                  <div className="text-[10px] text-[#5a8a9a] mt-1">{p.taxLabel}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
