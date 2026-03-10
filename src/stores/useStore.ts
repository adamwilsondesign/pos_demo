import { useState, useCallback } from 'react';
import type { CartItem, Payment, Transaction } from './demoData';
import { calculateConvenienceFee } from './demoData';

let nextId = 1;

export type DemoMode = 'setup' | 'transaction' | 'refund';
export type SetupScreen = 'staff' | 'static-item' | 'integrated-item' | 'users' | 'discounts';
export type TransactionScreen = 'home' | 'checkout' | 'payment' | 'payment-terminal' | 'payment-success' | 'receipt';
export type RefundScreen = 'history' | 'detail' | 'refund-process' | 'refund-success' | 'reports' | 'end-of-day';

export function useStore() {
  const [mode, setMode] = useState<DemoMode>('transaction');
  const [setupScreen, setSetupScreen] = useState<SetupScreen>('staff');
  const [transactionScreen, setTransactionScreen] = useState<TransactionScreen>('home');
  const [refundScreen, setRefundScreen] = useState<RefundScreen>('history');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);

  const [lookupModal, setLookupModal] = useState<string | null>(null);
  const [productModal, setProductModal] = useState(false);
  const [customTiles, setCustomTiles] = useState<string[]>([]);

  const addTile = useCallback((tileId: string) => {
    setCustomTiles(prev => prev.includes(tileId) ? prev : [...prev, tileId]);
  }, []);

  const addToCart = useCallback((item: Omit<CartItem, 'id' | 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name && i.accountRef === item.accountRef);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, id: `item-${nextId++}`, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.id !== id));
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    }
  }, []);

  const applyDiscount = useCallback((id: string, amount: number, label: string) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, discountAmount: amount, discountLabel: label } : i));
  }, []);

  const cartSubtotal = cart.reduce((sum, i) => {
    const effectivePrice = i.discountAmount ? (i.price - i.discountAmount) : i.price;
    return sum + effectivePrice * i.quantity;
  }, 0);

  const cartTax = cart.reduce((sum, i) => {
    const effectivePrice = i.discountAmount ? (i.price - i.discountAmount) : i.price;
    return sum + effectivePrice * i.quantity * i.taxRate;
  }, 0);

  const cartConvenienceFee = cart.reduce((sum, i) => sum + calculateConvenienceFee(i), 0);
  const cartTotal = cartSubtotal + cartTax + cartConvenienceFee;
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingBalance = Math.max(0, cartTotal - totalPaid);

  const addPayment = useCallback((payment: Payment) => {
    setPayments(prev => [...prev, payment]);
  }, []);

  const completeTransaction = useCallback((finalPayment?: Payment) => {
    const allPayments = finalPayment ? [...payments, finalPayment] : [...payments];
    const txn: Transaction = {
      id: `TXN-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      totalTax: cartTax,
      totalConvenienceFee: cartConvenienceFee,
      total: cartTotal,
      payments: allPayments,
      status: 'completed',
      receiptNumber: `RCP-${Math.floor(Math.random() * 900000 + 100000)}`,
    };
    setCompletedTransaction(txn);
    return txn;
  }, [cart, cartSubtotal, cartTax, cartConvenienceFee, cartTotal, payments]);

  const resetTransaction = useCallback(() => {
    setCart([]);
    setPayments([]);
    setCompletedTransaction(null);
    setTransactionScreen('home');
  }, []);

  return {
    mode, setMode,
    setupScreen, setSetupScreen,
    transactionScreen, setTransactionScreen,
    refundScreen, setRefundScreen,
    cart, addToCart, removeFromCart, updateQuantity, applyDiscount,
    cartSubtotal, cartTax, cartConvenienceFee, cartTotal,
    payments, addPayment, totalPaid, remainingBalance,
    completedTransaction, setCompletedTransaction, completeTransaction,
    resetTransaction,
    lookupModal, setLookupModal,
    productModal, setProductModal,
    customTiles, addTile,
  };
}
