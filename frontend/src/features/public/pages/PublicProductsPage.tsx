import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, openCart } from '../../../store/slices/cartSlice';
import { Search, ShoppingCart, Loader2, Image as ImageIcon, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../store';

export default function PublicProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
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

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addItem({
      id: product.id,
      name: product.name,
      sku: product.sku || `PRD-${product.id}`,
      price: product.price,
    }));
    dispatch(openCart());
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
              onClick={() => dispatch(openCart())}
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
                <div 
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="relative h-56 bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden cursor-pointer"
                >
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
                    <h3 
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 cursor-pointer hover:text-brand-500 transition-colors"
                    >
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mb-4">SKU: {product.sku}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                      {formatCurrency(product.price)}
                    </span>
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
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
    </div>
  );
}
