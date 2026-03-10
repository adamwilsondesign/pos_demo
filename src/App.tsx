import { useState, useCallback } from 'react';
import { useStore } from './stores/useStore';
import { Sidebar } from './components/layout/Sidebar';
import { CartPanel } from './components/layout/CartPanel';
import { StaffAccess } from './components/setup/StaffAccess';
import { StaticItemConfig } from './components/setup/StaticItemConfig';
import { IntegratedItemConfig } from './components/setup/IntegratedItemConfig';
import { UserSetup } from './components/setup/UserSetup';
import { DiscountConfig } from './components/setup/DiscountConfig';
import { SmartGrid } from './components/transaction/SmartGrid';
import { LookupModal } from './components/transaction/LookupModal';
import { ProductModal } from './components/transaction/ProductModal';
import { CheckoutScreen } from './components/transaction/CheckoutScreen';
import { PaymentScreen } from './components/transaction/PaymentScreen';
import { PaymentTerminal } from './components/transaction/PaymentTerminal';
import { PaymentSuccess } from './components/transaction/PaymentSuccess';
import { ReceiptModal } from './components/transaction/ReceiptModal';
import { TransactionHistory } from './components/refund/TransactionHistory';
import { TransactionDetail } from './components/refund/TransactionDetail';
import { RefundProcess } from './components/refund/RefundProcess';
import { RefundSuccess } from './components/refund/RefundSuccess';
import { Reports } from './components/refund/Reports';
import { EndOfDay } from './components/refund/EndOfDay';
import type { Payment } from './stores/demoData';

export default function App() {
  const store = useStore();
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'cash' | 'cheque'>('credit');
  const [showTerminal, setShowTerminal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [refundInfo, setRefundInfo] = useState<{ id: string; amount: number; item: string } | null>(null);

  const handleCheckout = () => {
    store.setTransactionScreen('checkout');
  };

  const handlePayment = (method: 'credit' | 'cash' | 'cheque') => {
    setPaymentMethod(method);
    store.setTransactionScreen('payment');
  };

  const handleProcessPayment = useCallback((payment: Payment) => {
    store.addPayment(payment);
    const newTotalPaid = store.totalPaid + payment.amount;
    const newRemaining = store.cartTotal - newTotalPaid;

    if (newRemaining <= 0.01) {
      store.completeTransaction(payment);
      store.setTransactionScreen('payment-success');
    } else {
      // Partial — stay on checkout for next payment
      store.setTransactionScreen('checkout');
    }
  }, [store]);

  const handleTerminalComplete = useCallback((payment: Payment) => {
    setShowTerminal(false);
    handleProcessPayment(payment);
  }, [handleProcessPayment]);

  const handleRefundComplete = (itemId: string, amount: number, reason: string) => {
    if (!store.completedTransaction) return;
    const refundId = `RFD-${Math.floor(Math.random() * 900000 + 100000)}`;
    const item = store.completedTransaction.items.find(i => i.id === itemId);

    const updatedTxn = {
      ...store.completedTransaction,
      status: 'partial_refund' as const,
      refunds: [
        ...(store.completedTransaction.refunds || []),
        { itemId, amount, reason, refundId, date: new Date().toISOString() },
      ],
    };
    store.setCompletedTransaction(updatedTxn);
    setRefundInfo({ id: refundId, amount, item: item?.name || '' });
    store.setRefundScreen('refund-success');
  };

  // Show cart panel only on home & checkout in transaction mode
  const showCart = store.mode === 'transaction' && (store.transactionScreen === 'home');

  return (
    <div className="flex h-full w-full bg-pos-bg">
      <Sidebar
        mode={store.mode}
        setMode={store.setMode}
        setupScreen={store.setupScreen}
        setSetupScreen={store.setSetupScreen}
        transactionScreen={store.transactionScreen}
        setTransactionScreen={store.setTransactionScreen}
        refundScreen={store.refundScreen}
        setRefundScreen={store.setRefundScreen}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Setup screens */}
          {store.mode === 'setup' && store.setupScreen === 'staff' && <StaffAccess />}
          {store.mode === 'setup' && store.setupScreen === 'static-item' && <StaticItemConfig />}
          {store.mode === 'setup' && store.setupScreen === 'integrated-item' && <IntegratedItemConfig />}
          {store.mode === 'setup' && store.setupScreen === 'users' && <UserSetup />}
          {store.mode === 'setup' && store.setupScreen === 'discounts' && <DiscountConfig />}

          {/* Transaction screens */}
          {store.mode === 'transaction' && store.transactionScreen === 'home' && (
            <SmartGrid
              onOpenLookup={(cat) => store.setLookupModal(cat)}
              onOpenProducts={() => store.setProductModal(true)}
              addToCart={store.addToCart}
            />
          )}
          {store.mode === 'transaction' && store.transactionScreen === 'checkout' && (
            <CheckoutScreen
              cart={store.cart}
              subtotal={store.cartSubtotal}
              tax={store.cartTax}
              convenienceFee={store.cartConvenienceFee}
              total={store.cartTotal}
              onBack={() => store.setTransactionScreen('home')}
              onPayment={handlePayment}
            />
          )}
          {store.mode === 'transaction' && store.transactionScreen === 'payment' && (
            <PaymentScreen
              method={paymentMethod}
              total={store.cartTotal}
              remainingBalance={store.remainingBalance}
              totalPaid={store.totalPaid}
              onProcessPayment={handleProcessPayment}
              onBack={() => store.setTransactionScreen('checkout')}
              onShowTerminal={() => setShowTerminal(true)}
            />
          )}
          {store.mode === 'transaction' && store.transactionScreen === 'payment-success' && store.completedTransaction && (
            <PaymentSuccess
              transaction={store.completedTransaction}
              onNewTransaction={store.resetTransaction}
              onReceipt={() => setShowReceipt(true)}
            />
          )}

          {/* Refund screens */}
          {store.mode === 'refund' && store.refundScreen === 'history' && (
            <TransactionHistory
              completedTransaction={store.completedTransaction}
              onViewDetail={() => store.setRefundScreen('detail')}
            />
          )}
          {store.mode === 'refund' && store.refundScreen === 'detail' && (
            <TransactionDetail
              transaction={store.completedTransaction}
              onBack={() => store.setRefundScreen('history')}
              onRefund={() => store.setRefundScreen('refund-process')}
            />
          )}
          {store.mode === 'refund' && store.refundScreen === 'refund-process' && (
            <RefundProcess
              transaction={store.completedTransaction}
              onBack={() => store.setRefundScreen('detail')}
              onComplete={handleRefundComplete}
            />
          )}
          {store.mode === 'refund' && store.refundScreen === 'refund-success' && refundInfo && (
            <RefundSuccess
              refundId={refundInfo.id}
              amount={refundInfo.amount}
              itemName={refundInfo.item}
              transactionId={store.completedTransaction?.id || ''}
              onBack={() => store.setRefundScreen('detail')}
            />
          )}
          {store.mode === 'refund' && store.refundScreen === 'reports' && <Reports />}
          {store.mode === 'refund' && store.refundScreen === 'end-of-day' && <EndOfDay />}
        </div>

        {/* Cart panel */}
        {showCart && (
          <CartPanel
            cart={store.cart}
            removeFromCart={store.removeFromCart}
            updateQuantity={store.updateQuantity}
            applyDiscount={store.applyDiscount}
            subtotal={store.cartSubtotal}
            tax={store.cartTax}
            convenienceFee={store.cartConvenienceFee}
            total={store.cartTotal}
            onCheckout={handleCheckout}
          />
        )}
      </div>

      {/* Modals */}
      <LookupModal
        category={store.lookupModal}
        onClose={() => store.setLookupModal(null)}
        addToCart={store.addToCart}
      />
      <ProductModal
        open={store.productModal}
        onClose={() => store.setProductModal(false)}
        addToCart={store.addToCart}
      />
      <ReceiptModal
        open={showReceipt}
        onClose={() => setShowReceipt(false)}
        transaction={store.completedTransaction}
      />

      {/* Payment terminal overlay */}
      {showTerminal && (
        <PaymentTerminal
          amount={store.remainingBalance}
          onComplete={handleTerminalComplete}
          onCancel={() => setShowTerminal(false)}
        />
      )}
    </div>
  );
}
