import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';

const mockProducts = [
  { id: '1', name: 'Industrial Circuit Breaker', sku: 'ICB-500', price: '$245.00', stock: 120, status: 'In Stock' },
  { id: '2', name: 'Commercial LED Panel', sku: 'CLP-202', price: '$89.99', stock: 450, status: 'In Stock' },
  { id: '3', name: 'Heavy Duty Cable Reel', sku: 'HDR-100', price: '$150.00', stock: 12, status: 'Low Stock' },
  { id: '4', name: 'Smart Power Meter', sku: 'SPM-300', price: '$320.00', stock: 0, status: 'Out of Stock' },
  { id: '5', name: 'Distribution Transformer', sku: 'DTX-800', price: '$1,200.00', stock: 5, status: 'In Stock' },
];

export default function ProductCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
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
                <th className="px-6 py-4">Price</th>
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
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md font-medium text-xs ${
                      product.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-400' :
                      product.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
        <div className="p-4 border-t border-dark-700 bg-dark-800/30 flex items-center justify-between text-sm text-slate-400">
          <span>Showing 1 to 5 of 5 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md hover:bg-dark-700 transition-colors disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded-md bg-brand-500 text-white">1</button>
            <button className="px-3 py-1 rounded-md hover:bg-dark-700 transition-colors disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
