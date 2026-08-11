import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-24 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Information We Collect</h2>
              <p>At Collos Hardware, we collect information that you provide directly to us, including your name, email address, phone number, delivery address, and payment information when you register an account, make a purchase, or contact our support team.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Process and fulfill your orders, including sending payment requests (like M-Pesa STK Push).</li>
                <li>Communicate with you about products, services, and order statuses.</li>
                <li>Maintain and improve our platform's security and performance.</li>
                <li>Comply with legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or alteration. Payment transactions are processed securely through trusted payment gateways like Safaricom M-Pesa.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information. If you wish to exercise these rights, please contact us at privacy@colloshardware.com.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
