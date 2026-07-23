import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, CartItem } from '../../../store/slices/cartSlice';
import { Search, ShoppingCart, Loader2, Image as ImageIcon, Zap, AlertCircle, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { updateQuantity, removeItem } from '../../../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';

export default function PublicProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  
  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ['public-products', searchTerm],
    queryFn: async () => {
      const response = await api.get('/catalog/products', {
        params: { search: searchTerm }
      });
      return response.data;
    },
    refetchInterval: 60000,
  });

  const products = responseData?.data || [];

  const handleAddToCart = (product: any) => {
    dispatch(addItem({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
    }));
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      // Redirect to login with a message or just redirect
      navigate('/login?redirect=checkout');
    } else {
      // Redirect to a secure checkout page (or dashboard pos)
      navigate('/dashboard/pos');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-10 animate-pulse-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Our <span className="text-brand-500">Products</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Browse our premium selection of electrical and hardware components. High quality, enterprise grade.
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm"
              />
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 transition-all shadow-sm group"
            >
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {isError && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>We couldn't load the products at this time. Please try again later.</p>
          </div>
        )}

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading catalog...</p>
          </div>
        ) : products.length === 0 && !isError ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product: any, index: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl dark:hover:shadow-brand-500/10 transition-all duration-300 group flex flex-col"
              >
                {/* Product Image */}
                <div className="relative h-56 bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                      <span className="text-sm font-medium">No Image</span>
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold rounded-full shadow-sm">
                      {product.category || 'General'}
                    </span>
                  </div>
                  {/* Status Badge */}
                  {product.status !== 'In Stock' && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">
                        {product.status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mb-4">SKU: {product.sku}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                      {formatCurrency(product.price)}
                    </span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={product.status === 'Out of Stock'}
                      className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center hover:bg-brand-600 hover:text-white dark:hover:bg-brand-500 dark:hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Add to Cart"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Shopping Cart Drawer Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Cart</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                    <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">Your cart is empty</p>
                    <p className="text-sm mt-1">Looks like you haven't added any products yet.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-6 px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cartItems.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{item.sku}</p>
                        <p className="font-bold text-brand-600 dark:text-brand-400 text-sm">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between">
                        <button 
                          onClick={() => dispatch(removeItem(item.id))}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                          <button 
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-4 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Total</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
