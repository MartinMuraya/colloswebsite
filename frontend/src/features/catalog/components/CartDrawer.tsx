import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { closeCart, removeItem, updateQuantity, clearCart } from '../../../store/slices/cartSlice';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const { items, totalAmount, isOpen } = useSelector((state: RootState) => state.cart);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  const handleClose = () => dispatch(closeCart());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={handleClose}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-dark-800 border-l border-dark-700 shadow-2xl z-50 flex flex-col"
          >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-dark-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-xl font-bold text-white">Your Cart</h2>
                  </div>
                  <button 
                    onClick={handleClose}
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
                        onClick={() => {
                          handleClose();
                          window.location.href = '/checkout';
                        }}
                        className="btn-primary py-3 text-sm"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
