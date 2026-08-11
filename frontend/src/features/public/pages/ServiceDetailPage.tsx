import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { Loader2, ArrowLeft, Zap, Clock, Wrench, Home, Building2, Factory } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ['service', slug],
    queryFn: async () => {
      const response = await api.get(`/services/${slug}`);
      return response.data;
    }
  });

  const service = responseData?.service;

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
    </div>
  );

  if (isError || !service) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Zap className="w-10 h-10 text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Service Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">We couldn't find the service you're looking for.</p>
      <button onClick={() => navigate('/services')} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
        Browse All Services
      </button>
    </div>
  );

  const serviceTypes = [
    { key: 'is_residential', label: 'Residential', icon: Home, color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' },
    { key: 'is_commercial', label: 'Commercial', icon: Building2, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
    { key: 'is_industrial', label: 'Industrial', icon: Factory, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        {service.featured_image_url ? (
          <img src={service.featured_image_url} alt={service.name} className="w-full h-full object-cover opacity-30" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Zap className="w-64 h-64 text-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <button onClick={() => navigate('/services')} className="flex items-center text-white/80 hover:text-white mb-4 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
          </button>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
              {service.category || 'Uncategorized'}
            </span>
            {service.service_type && (
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                {service.service_type}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{service.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            {/* Short Description */}
            {service.short_description && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{service.short_description}</p>
              </div>
            )}

            {/* Full Description */}
            {service.full_description && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About This Service</h2>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {service.full_description}
                </div>
              </div>
            )}

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What's Included</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Wrench className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gallery */}
            {service.gallery_images && service.gallery_images.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {service.gallery_images.map((img: string, i: number) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img src={img} alt={`${service.name} gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:w-80 space-y-6"
          >
            {/* Service Types */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Available For</h3>
              <div className="space-y-3">
                {serviceTypes.map((type) => {
                  const isAvailable = service[type.key];
                  const Icon = type.icon;
                  return (
                    <div 
                      key={type.key} 
                      className={`flex items-center gap-3 p-3 rounded-xl ${isAvailable ? type.color : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600'}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold text-sm">{type.label}</span>
                      {isAvailable && (
                        <span className="ml-auto text-xs font-bold px-2 py-0.5 bg-white/50 dark:bg-black/20 rounded-full">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Duration */}
            {service.estimated_duration && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Estimated Duration</h3>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{service.estimated_duration}</span>
                </div>
              </div>
            )}

            {/* Tags */}
            {service.tags && service.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">Need This Service?</h3>
              <p className="text-blue-100 text-sm mb-4">Get in touch with our team for a free consultation and quote.</p>
              <button 
                onClick={() => navigate('/contact')}
                className="w-full py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Request a Quote
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
