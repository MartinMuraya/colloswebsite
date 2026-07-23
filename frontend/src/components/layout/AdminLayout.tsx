import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  Menu, 
  Zap,
  CreditCard,
  Shield
} from 'lucide-react';

export default function AdminLayout() {
  const [isSidebarOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Catalog', icon: Package, path: '/dashboard/catalog' },
    { name: 'Customers', icon: Users, path: '/dashboard/customers' },
    { name: 'Payments', icon: CreditCard, path: '/dashboard/payments' },
    { name: 'User Roles', icon: Shield, path: '/dashboard/users' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50 dark:bg-gray-900 transition-colors w-full h-full relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarOpen ? '260px' : '80px',
          x: isMobileOpen ? 0 : (window.innerWidth < 1024 ? -260 : 0)
        }}
        className="absolute lg:relative z-50 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0 flex flex-col shadow-2xl transition-colors"
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-blue-400 dark:from-brand-600 dark:to-brand-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <motion.span 
              animate={{ opacity: isSidebarOpen ? 1 : 0, display: isSidebarOpen ? 'block' : 'none' }}
              className="font-display font-bold text-xl tracking-tight text-gray-900 dark:text-white whitespace-nowrap"
            >
              Admin
            </motion.span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-xl transition-all group overflow-hidden
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20' 
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-transparent'}
              `}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <motion.span 
                animate={{ opacity: isSidebarOpen ? 1 : 0, display: isSidebarOpen ? 'block' : 'none' }}
                className="font-medium whitespace-nowrap"
              >
                {item.name}
              </motion.span>
            </NavLink>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Mobile menu toggle inside Dashboard */}
        <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-3">
          <button 
            onClick={() => setMobileOpen(!isMobileOpen)}
            className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700/50 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-900 dark:text-white">Admin Menu</span>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
