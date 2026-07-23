import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2, Smartphone, Loader2, CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { removeItem, updateQuantity, clearCart } from '../../../store/slices/cartSlice';
import axios from '../../../lib/axios';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);

  // M-Pesa Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  const handleCheckoutClick = () => {
    setIsCheckoutOpen(true);
    setPaymentStatus('idle');
    setPhoneNumber('');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsProcessing(true);
    setPaymentStatus('idle');

    try {
      const response = await axios.post('/payments/mpesa/stk-push', {
        phone_number: phoneNumber,
        amount: totalAmount,
        order_reference: 'ORD-' + Math.floor(Math.random() * 1000000), // Generate a random order ref for now
        description: `Payment for ${items.length} items`
      });

      if (response.data.status === 'success') {
        setPaymentStatus('success');
        dispatch(clearCart()); // Clear cart on success
      }
    } catch (error: any) {
      setPaymentStatus('error');
      setErrorMessage(error.response?.data?.error || 'Failed to initiate M-Pesa STK Push.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-dark-800 border-l border-dark-700 shadow-2xl z-50 flex flex-col"
          >
            {isCheckoutOpen ? (
              // M-PESA CHECKOUT VIEW
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-dark-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Lipa na M-Pesa</h2>
                  </div>
                  <button 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  {paymentStatus === 'success' ? (
                    <div className="text-center py-6">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4"
                      >
                        <CheckCircle2 className="w-8 h-8" />
                      </motion.div>
                      <h4 className="text-lg font-semibold text-white mb-2">Check Your Phone!</h4>
                      <p className="text-sm text-slate-400">An STK Push prompt has been sent to your phone. Enter your M-Pesa PIN to complete the payment for <span className="text-white font-medium">{formatCurrency(totalAmount)}</span>.</p>
                      <button 
                        onClick={() => {
                          setIsCheckoutOpen(false);
                          onClose();
                        }}
                        className="mt-6 w-full btn-secondary"
                      >
                        Close Cart
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePaymentSubmit}>
                      <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-600 mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Total Items</span>
                          <span className="text-sm font-medium text-white">{items.length} items</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Total Amount</span>
                          <span className="text-lg font-bold text-emerald-400">{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">M-Pesa Phone Number</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="e.g., 254712345678"
                            className="input-field"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                          <p className="text-xs text-slate-500 mt-2">Enter your Safaricom number starting with 254 or 07...</p>
                        </div>

                        {paymentStatus === 'error' && (
                          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                            {errorMessage}
                          </div>
                        )}
                      </div>

                      <button 
                        type="submit" 
                        disabled={isProcessing || !phoneNumber}
                        className="w-full relative inline-flex items-center justify-center px-6 py-3 font-medium text-white transition-all duration-300 rounded-lg bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Initiating STK Push...
                          </>
                        ) : (
                          'Pay Now'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              // CART VIEW
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-dark-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-xl font-bold text-white">Your Cart</h2>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                      <p>Your cart is empty.</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="bg-dark-900/50 border border-dark-600 rounded-xl p-4 flex gap-4 relative group">
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1">{item.name}</h4>
                          <p className="text-xs text-slate-500 font-mono mb-2">{item.sku}</p>
                          <div className="text-emerald-400 font-bold">{formatCurrency(item.price)}</div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button 
                            onClick={() => dispatch(removeItem(item.id))}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-center gap-3 bg-dark-800 rounded-lg border border-dark-600 px-2 py-1">
                            <button 
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                              className="text-slate-400 hover:text-white disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                              className="text-slate-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {items.length > 0 && (
                  <div className="p-6 border-t border-dark-700 bg-dark-900/30">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-xl font-bold text-emerald-400">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => dispatch(clearCart())}
                        className="btn-secondary py-3 text-sm"
                      >
                        Clear Cart
                      </button>
                      <button 
                        onClick={handleCheckoutClick}
                        className="btn-primary py-3 text-sm"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
