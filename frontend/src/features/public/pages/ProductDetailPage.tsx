import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { useDispatch } from 'react-redux';
import { addItem } from '../../../store/slices/cartSlice';
import { Loader2, ArrowLeft, Plus, Image as ImageIcon } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get(`/catalog/products/${id}`);
      return response.data;
    }
  });

  const product = responseData?.product;

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addItem({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
    }));
    // Most Ecommerce sites pop the cart open here. For now we just add.
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
    </div>
  );

  if (isError || !product) return (
    <div className="p-8 text-center text-red-500">Failed to load product.</div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate('/products')} className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Catalog
      </button>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/2">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 aspect-square flex items-center justify-center overflow-hidden relative">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-contain rounded-xl hover:scale-105 transition-transform duration-500" />
            ) : (
              <ImageIcon className="w-32 h-32 text-gray-300" />
            )}
             {/* Category Badge */}
             <div className="absolute top-4 left-4">
               <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold rounded-full shadow-sm">
                 {product.category || 'General'}
               </span>
             </div>
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 font-mono mb-6">SKU: {product.sku}</p>
          
          <div className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-6">
            KES {product.price}
          </div>

          <div className="prose dark:prose-invert mb-8 text-gray-600 dark:text-gray-300">
            {product.description || "Premium enterprise-grade hardware component. Certified for heavy-duty B2B applications."}
          </div>

          {/* Variants / Attributes (from the JSON column) */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Specifications</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                {Object.entries(product.attributes).map(([key, value]: any) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize mb-1">{key.replace('_', ' ')}</dt>
                    <dd className="text-sm text-gray-900 dark:text-white font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleAddToCart}
              disabled={product.status === 'Out of Stock'}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-brand-500/25"
            >
              <Plus className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            {product.status === 'Out of Stock' && (
              <p className="text-red-500 text-center mt-4 font-medium">Currently Out of Stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
