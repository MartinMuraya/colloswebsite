import React, { useState, useEffect } from 'react';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, CheckCircle, Package, Tag, DollarSign, Eye, Star, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export default function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [shortDescription, setShortDescription] = useState('');
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const { data: categoriesData } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const response = await api.get('/catalog/categories');
      return response.data.data;
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (catName: string) => {
      const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      return api.post('/catalog/categories', { 
        name: catName, 
        slug, 
        is_published: true,
        show_in_navigation: true,
        sort_order: 0
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      setCategoryId(res.data.category.id.toString());
      setIsCreatingCategory(false);
      setNewCategoryName('');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create category');
    }
  });

  const handleCreateCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    createCategoryMutation.mutate(newCategoryName);
  };

  useEffect(() => {
    setPreviewError(false);
    if (product) {
      setName(product.name || '');
      setSku(product.sku || '');
      setPrice(product.price ? product.price.toString() : '');
      setStock(product.stock !== undefined ? product.stock.toString() : '');
      setCategoryId(product.category_id ? product.category_id.toString() : '1');
      setShortDescription(product.short_description || '');
      setIsPublished(product.is_published ?? true);
      setIsFeatured(product.is_featured ?? false);
      if (product.image_url) {
        setImageUrl(product.image_url);
        setImageMode('url');
      } else {
        setImageUrl('');
        setImageMode('url');
      }
      setImage(null);
    } else {
      setName('');
      setSku('');
      setPrice('');
      setStock('');
      setCategoryId('1');
      setShortDescription('');
      setImageUrl('');
      setImage(null);
      setImageMode('url');
      setIsPublished(true);
      setIsFeatured(false);
    }
  }, [product, isOpen]);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (product) {
        return api.post(`/catalog/products/${product.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      return api.post('/catalog/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'An error occurred while saving the product');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('sku', sku);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category_id', categoryId);
    formData.append('short_description', shortDescription);
    formData.append('status', parseInt(stock || '0') > 0 ? 'In Stock' : 'Out of Stock');
    formData.append('is_published', isPublished ? '1' : '0');
    formData.append('is_featured', isFeatured ? '1' : '0');
    
    if (imageMode === 'file' && image) {
      formData.append('image', image);
    } else if (imageMode === 'url' && imageUrl.trim()) {
      formData.append('image_url', imageUrl.trim());
    }

    mutation.mutate(formData);
  };

  if (!isOpen) return null;

  const calculatedStatus = parseInt(stock || '0') > 10 ? 'In Stock' : parseInt(stock || '0') > 0 ? 'Low Stock' : 'Out of Stock';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {product ? 'Edit Product Details' : 'Add New Product'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Organize inventory, set prices, and upload Cloudinary media.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-gray-900 dark:text-gray-100">
          
          {/* Section 1: General Product Information */}
          <div className="bg-gray-50/60 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200/60 dark:border-gray-700/60">
              <Tag className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Basic Information</h3>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input 
                required 
                type="text" 
                placeholder="e.g., Double Pole Circuit Breaker 63A"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white" 
              />
            </div>

            {/* SKU & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  SKU Code <span className="text-red-500">*</span>
                </label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g., PRD-CB-63A"
                  value={sku} 
                  onChange={(e) => setSku(e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                {!isCreatingCategory ? (
                  <div className="flex gap-2">
                    <select 
                      value={categoryId} 
                      onChange={(e) => setCategoryId(e.target.value)} 
                      className="flex-1 px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                    >
                      <option value="">Select Category</option>
                      {categoriesData?.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <button 
                      type="button" 
                      onClick={() => setIsCreatingCategory(true)} 
                      className="px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-lg transition-all whitespace-nowrap"
                    >
                      + New
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Category Name" 
                      value={newCategoryName} 
                      onChange={(e) => setNewCategoryName(e.target.value)} 
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" 
                    />
                    <button 
                      type="button" 
                      onClick={handleCreateCategory} 
                      disabled={createCategoryMutation.isPending} 
                      className="px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg whitespace-nowrap"
                    >
                      {createCategoryMutation.isPending ? '...' : 'Save'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsCreatingCategory(false)} 
                      className="px-2.5 py-2 text-xs text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                Short Description
              </label>
              <textarea 
                rows={2}
                placeholder="Brief summary of product features and specs..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3.5 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Inventory */}
          <div className="bg-gray-50/60 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60 dark:border-gray-700/60">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Pricing & Inventory</h3>
              </div>
              {stock !== '' && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  calculatedStatus === 'In Stock' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                  calculatedStatus === 'Low Stock' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                  'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                }`}>
                  {calculatedStatus}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Price (KES) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-bold">KES</span>
                  <input 
                    required 
                    type="number" 
                    min="0" 
                    step="0.01"
                    placeholder="0.00"
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="w-full pl-12 pr-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-emerald-600 dark:text-emerald-400 focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  Stock Units <span className="text-red-500">*</span>
                </label>
                <input 
                  required 
                  type="number" 
                  min="0" 
                  placeholder="e.g., 50"
                  value={stock} 
                  onChange={(e) => setStock(e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" 
                />
              </div>
            </div>
          </div>

          {/* Section 3: Media & Cloudinary Integration */}
          <div className="bg-gray-50/60 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60 dark:border-gray-700/60">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Product Media & Cloudinary</h3>
              </div>

              {/* Toggle Mode */}
              <div className="flex p-0.5 bg-gray-200/70 dark:bg-gray-700/70 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    imageMode === 'url' ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Cloudinary URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    imageMode === 'file' ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              </div>
            </div>

            {imageMode === 'url' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                    Cloudinary / Image Link
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="url"
                      placeholder="https://res.cloudinary.com/your-cloud/image/upload/v123/product.jpg"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setPreviewError(false);
                      }}
                      className="flex-1 px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all font-mono dark:text-white"
                    />
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => { setImageUrl(''); setPreviewError(false); }}
                        className="px-3 py-2 text-xs text-gray-500 hover:text-red-500 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    Enter a Cloudinary URL, Unsplash link, or web image address.
                  </p>
                </div>

                {/* Preview Card for URL */}
                {imageUrl.trim() && (
                  <div className="flex items-center gap-4 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex-shrink-0 flex items-center justify-center">
                      {!previewError ? (
                        <img 
                          src={imageUrl} 
                          alt="Product preview" 
                          className="w-full h-full object-cover" 
                          onError={() => setPreviewError(true)}
                        />
                      ) : (
                        <div className="text-center p-1">
                          <ImageIcon className="w-5 h-5 text-amber-500 mx-auto" />
                          <span className="text-[10px] text-amber-500 font-medium">Link error</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{imageUrl}</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Ready to attach to product</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-gray-900 transition-colors group">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {image ? image.name : 'Click to select image file from computer'}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 2MB</span>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => setImage(e.target.files?.[0] || null)} 
                  />
                </label>
              </div>
            )}
          </div>

          {/* Section 4: Publishing & Display Options */}
          <div className="bg-gray-50/60 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                <input 
                  type="checkbox" 
                  checked={isPublished} 
                  onChange={(e) => setIsPublished(e.target.checked)} 
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" 
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    <span>Published</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Visible to customers in storefront</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-amber-500 transition-colors">
                <input 
                  type="checkbox" 
                  checked={isFeatured} 
                  onChange={(e) => setIsFeatured(e.target.checked)} 
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500" 
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>Featured Item</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Highlighted on homepage showcase</p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={mutation.isPending} 
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Product...</span>
                </>
              ) : (
                <span>{product ? 'Update Product' : 'Save Product'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
