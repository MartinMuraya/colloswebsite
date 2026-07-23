import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Smartphone, X, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const mockProducts = [
  { id: '1', name: 'Industrial Circuit Breaker', sku: 'ICB-500', price: 24500, stock: 120, status: 'In Stock' },
  { id: '2', name: 'Commercial LED Panel', sku: 'CLP-202', price: 8999, stock: 450, status: 'In Stock' },
  { id: '3', name: 'Heavy Duty Cable Reel', sku: 'HDR-100', price: 15000, stock: 12, status: 'Low Stock' },
  { id: '4', name: 'Smart Power Meter', sku: 'SPM-300', price: 32000, stock: 0, status: 'Out of Stock' },
  { id: '5', name: 'Distribution Transformer', sku: 'DTX-800', price: 120000, stock: 5, status: 'In Stock' },
];

export default function ProductCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // M-Pesa Modal State
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleBuyClick = (product: typeof mockProducts[0]) => {
    setSelectedProduct(product);
    setPaymentStatus('idle');
    setPhoneNumber('');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsProcessing(true);
    setPaymentStatus('idle');

    try {
      const response = await axios.post('http://localhost:8000/api/payments/mpesa/stk-push', {
        phone_number: phoneNumber,
        amount: selectedProduct.price,
        order_reference: selectedProduct.sku,
        description: `Payment for ${selectedProduct.name}`
      });

      if (response.data.status === 'success') {
        setPaymentStatus('success');
      }
    } catch (error: any) {
      setPaymentStatus('error');
      setErrorMessage(error.response?.data?.error || 'Failed to initiate M-Pesa STK Push. Ensure the backend is running.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 relative"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1">Product Catalog</h1>
          <p className="text-slate-400">Manage your electrical inventory and pricing.</p>
        </div>
        <button className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            className="input-field pl-10 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="btn-secondary py-2 px-4 text-sm w-full md:w-auto flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-800/50 border-b border-dark-700 text-slate-400 text-sm font-medium uppercase tracking-wider">
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Price (KES)</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/50 text-sm text-slate-300">
              {mockProducts.map((product) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={product.id} 
                  className="hover:bg-dark-700/30 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{product.sku}</td>
                  <td className="px-6 py-4 font-medium text-emerald-400">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md font-medium text-xs ${
                      product.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      product.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleBuyClick(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-all border border-emerald-500/20"
                        title="Simulate M-Pesa Purchase"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Pay via M-Pesa</span>
                      </button>
                      <div className="w-px h-4 bg-dark-600 mx-1"></div>
                      <button className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* M-Pesa Payment Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 glass-panel border border-brand-500/30 shadow-[0_0_50px_rgba(20,184,166,0.15)]"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Lipa na M-Pesa</h3>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

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
                  <p className="text-sm text-slate-400">An STK Push prompt has been sent to your phone. Enter your M-Pesa PIN to complete the payment for <span className="text-white font-medium">{selectedProduct.name}</span>.</p>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="mt-6 w-full btn-secondary"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePaymentSubmit}>
                  <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-600 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-400">Item</span>
                      <span className="text-sm font-medium text-white">{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Amount to Pay</span>
                      <span className="text-lg font-bold text-emerald-400">{formatCurrency(selectedProduct.price)}</span>
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
