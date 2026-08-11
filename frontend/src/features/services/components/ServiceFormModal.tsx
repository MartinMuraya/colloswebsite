import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
}

export default function ServiceFormModal({ isOpen, onClose, service }: ServiceFormModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [image, setImage] = useState<File | null>(null);

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const { data: categoriesData } = useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const response = await api.get('/services/categories/admin/all');
      return response.data.data;
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      return api.post('/services/categories', { 
        name, 
        slug, 
        is_published: true,
        show_in_navigation: true,
        sort_order: 0
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
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
    if (service) {
      setName(service.name);
      setSlug(service.slug);
      setCategoryId(service.service_category_id ? service.service_category_id.toString() : '');
      setShortDescription(service.short_description || '');
      setIsPublished(service.is_published);
    } else {
      setName('');
      setSlug('');
      setCategoryId('');
      setShortDescription('');
      setIsPublished(true);
      setImage(null);
    }
  }, [service, isOpen]);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (service) {
        return api.post(`/services/${service.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      return api.post('/services', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services-admin'] });
      onClose();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'An error occurred while saving');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('service_category_id', categoryId);
    formData.append('short_description', shortDescription);
    formData.append('is_published', isPublished ? '1' : '0');
    
    if (image) {
      formData.append('featured_image', image);
    }

    mutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 z-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Name</label>
              <input required type="text" value={name} onChange={(e) => {
                setName(e.target.value);
                if (!service) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
              }} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
              <input required type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            {!isCreatingCategory ? (
              <div className="flex gap-2">
                <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Select Category</option>
                  {categoriesData?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setIsCreatingCategory(true)} className="px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg whitespace-nowrap">
                  + New
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input type="text" placeholder="Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                <button type="button" onClick={handleCreateCategory} disabled={createCategoryMutation.isPending} className="px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg whitespace-nowrap">
                  {createCategoryMutation.isPending ? '...' : 'Save'}
                </button>
                <button type="button" onClick={() => setIsCreatingCategory(false)} className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
            <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white h-24" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_published" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
            <label htmlFor="is_published" className="text-sm font-medium text-gray-700 dark:text-gray-300">Published</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Featured Image</label>
            <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="flex flex-col items-center">
                <Upload className="w-5 h-5 text-gray-400 mb-1" />
                <span className="text-sm text-gray-500">{image ? image.name : 'Upload image file'}</span>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-2 sticky bottom-0 bg-white dark:bg-gray-800 py-4 border-t border-gray-100 dark:border-gray-700 -mx-4 px-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">
              {mutation.isPending ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
