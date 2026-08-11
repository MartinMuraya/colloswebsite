import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { Plus, Search, Edit, Trash2, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import ServiceFormModal from '../components/ServiceFormModal';

export default function ServicesCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  
  const queryClient = useQueryClient();

  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ['services-admin', searchTerm],
    queryFn: async () => {
      const response = await api.get('/services/admin/all', {
        params: { search: searchTerm }
      });
      return response.data;
    },
    refetchInterval: 15000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services-admin'] });
    },
    onError: () => {
      alert('Failed to delete service');
    }
  });

  const services = responseData?.data || [];

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 relative"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1">Services Catalog</h1>
          <p className="text-gray-500 dark:text-slate-400">Manage your electrical engineering services.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {isError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>Failed to load services. Ensure the backend API is running.</p>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input 
            type="text" 
            placeholder="Search services by name..." 
            className="input-field pl-10 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-800/50 border-b border-gray-200 dark:border-dark-700 text-gray-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-700/50 text-sm text-gray-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading services...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No services found. Add a service to get started.
                  </td>
                </tr>
              ) : (
                services.map((service: any) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={service.id} 
                    className="hover:bg-gray-50 dark:hover:bg-dark-700/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      {service.featured_image_url ? (
                        <img src={service.featured_image_url} alt={service.name} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 dark:bg-dark-600 flex items-center justify-center text-gray-400 dark:text-slate-500">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      <span>{service.name}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-500 dark:text-slate-400">{service.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md font-medium text-xs ${
                        service.is_published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {service.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(service)} className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(service.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ServiceFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        service={selectedService} 
      />
    </motion.div>
  );
}
