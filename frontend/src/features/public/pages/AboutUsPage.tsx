import { motion } from 'framer-motion';
import { Target, Users, Shield, Award } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="py-24 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">About Collos Hardware</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Established in 2010, Collos Hardware has grown to become Nairobi's most trusted supplier of commercial and industrial electrical components. We don't just sell parts; we provide solutions that power industries.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img 
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop" 
              alt="Our Warehouse" 
              className="rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400">To supply the highest quality electrical components that ensure the safety, efficiency, and reliability of our clients' infrastructural projects across East Africa.</p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Quality Promise</h3>
              <p className="text-gray-600 dark:text-gray-400">We partner directly with global manufacturers like Schneider, ABB, and Legrand to ensure every product we sell is authentic and fully certified.</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-gray-100 dark:border-gray-800 pt-16">
          <div className="p-4">
            <h4 className="text-4xl font-extrabold text-blue-600 mb-2">14+</h4>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Years Experience</p>
          </div>
          <div className="p-4">
            <h4 className="text-4xl font-extrabold text-blue-600 mb-2">500+</h4>
            <p className="text-gray-600 dark:text-gray-400 font-medium">B2B Clients</p>
          </div>
          <div className="p-4">
            <h4 className="text-4xl font-extrabold text-blue-600 mb-2">10k+</h4>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Products Sold</p>
          </div>
          <div className="p-4">
            <h4 className="text-4xl font-extrabold text-blue-600 mb-2">100%</h4>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Authenticity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
