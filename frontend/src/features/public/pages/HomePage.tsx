import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';

export default function HomePage() {
  const { data: responseData, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await api.get('/catalog/products');
      return response.data;
    },
  });

  const products = responseData?.data?.slice(0, 4) || [];

  const features = [
    { icon: Zap, title: 'Premium Quality', desc: 'Sourced from top global manufacturers' },
    { icon: Shield, title: 'Certified Safe', desc: 'All products meet KEBS standards' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Country-wide dispatch within 24hrs' },
    { icon: Package, title: 'Bulk Supply', desc: 'Competitive pricing for large orders' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/demo/image/upload/v1683120194/cld-sample-2.jpg')] bg-cover bg-center opacity-5 dark:opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Trusted by 500+ Contractors
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Powering Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Projects Forward
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                Nairobi's leading supplier of industrial and commercial electrical components. We provide the spark for your success.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="#products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30">
                  Shop Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                  Request a Quote
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-3xl blur-3xl opacity-20 animate-pulse" />
              <img 
                src="https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?q=80&w=1200&auto=format&fit=crop" 
                alt="Electrical Components" 
                className="relative rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 object-cover h-[500px] w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
              <p className="text-gray-500 dark:text-gray-400">Discover our top-selling electrical supplies.</p>
            </div>
            <Link to="/catalog" className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-[350px]" />
              ))
            ) : products.map((product: any, i: number) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
              >
                <div className="aspect-square bg-gray-50 dark:bg-gray-900 p-6 relative overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="w-16 h-16 opacity-20" />
                    </div>
                  )}
                  {product.status === 'Out of Stock' && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">{product.category}</p>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">SKU: {product.sku}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      KES {new Intl.NumberFormat('en-KE').format(product.price)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
