import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
  return (
    <div className="py-24 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using Collos Hardware's website and services, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Products and Pricing</h2>
              <p>All products are subject to availability. We reserve the right to modify prices, discontinue products, or correct pricing errors at any time without prior notice. All prices are listed in Kenyan Shillings (KES) unless otherwise specified.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Orders and Payments</h2>
              <p>By submitting an order, you agree to pay the total amount including any applicable taxes and shipping fees. Payments made via M-Pesa are subject to Safaricom's terms and conditions. We reserve the right to cancel any order if payment is suspected to be fraudulent.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Shipping and Returns</h2>
              <p>Delivery times are estimates and may vary. Returns and refunds are subject to our Returns Policy, which requires reporting defective items within 7 days of delivery with original packaging and receipt.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Limitation of Liability</h2>
              <p>Collos Hardware shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services or products.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
