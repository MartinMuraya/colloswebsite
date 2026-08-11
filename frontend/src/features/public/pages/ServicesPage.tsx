import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, Zap } from 'lucide-react';

export default function ServicesPage() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['public-services', categorySlug],
    queryFn: async () => {
      // In a real scenario, you might pass categorySlug as a filter param
      // For now, we'll filter on the frontend for simplicity if backend doesn't support it
      const response = await api.get('/services');
      return response.data.data;
    }
  });

  const services = servicesData || [];
  const filteredServices = categorySlug 
    ? services.filter((s: any) => s.category.toLowerCase().replace(/ /g, '-') === categorySlug)
    : services;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Engineering Services</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Professional electrical engineering solutions for residential, commercial, and industrial applications.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service: any) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group"
            >
              <div className="h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                {service.featured_image_url ? (
                  <img src={service.featured_image_url} alt={service.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Zap className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full shadow-sm">
                    {service.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1 line-clamp-3">
                  {service.short_description || service.full_description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.is_residential && <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">Residential</span>}
                  {service.is_commercial && <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">Commercial</span>}
                  {service.is_industrial && <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">Industrial</span>}
                </div>
                <Link
                  to={`/services/${service.slug}`}
                  className="w-full text-center px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 rounded-xl font-semibold transition-colors"
                >
                  View Service Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {!isLoading && filteredServices.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No services found in this category.
        </div>
      )}
    </div>
  );
}
