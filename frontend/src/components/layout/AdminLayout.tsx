import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import CartDrawer from '../../features/catalog/components/CartDrawer';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  Zap,
  Bell,
  Search
} from 'lucide-react';

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Catalog', icon: Package, path: '/dashboard/catalog' },
    { name: 'Customers', icon: Users, path: '/dashboard/customers' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 flex overflow-hidden">
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
        className="fixed lg:relative z-50 h-full bg-dark-800 border-r border-dark-700 shrink-0 flex flex-col shadow-2xl"
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-dark-700">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(20,184,166,0.5)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <motion.span 
              animate={{ opacity: isSidebarOpen ? 1 : 0, display: isSidebarOpen ? 'block' : 'none' }}
              className="font-display font-bold text-xl tracking-tight text-white whitespace-nowrap"
            >
              Collos
            </motion.span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-xl transition-all group overflow-hidden
                ${isActive 
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-[inset_0_0_20px_rgba(20,184,166,0.05)]' 
                  : 'text-slate-400 hover:text-white hover:bg-dark-700/50 border border-transparent'}
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

        {/* User Profile */}
        <div className="p-4 border-t border-dark-700">
          <button className="flex items-center gap-3 w-full p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700/50 transition-colors">
            <LogOut className="w-5 h-5 shrink-0" />
            <motion.span 
              animate={{ opacity: isSidebarOpen ? 1 : 0, display: isSidebarOpen ? 'block' : 'none' }}
              className="font-medium whitespace-nowrap"
            >
              Logout
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-dark-800/80 backdrop-blur-md border-b border-dark-700 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (window.innerWidth < 1024) setMobileOpen(!isMobileOpen);
                else setSidebarOpen(!isSidebarOpen);
              }}
              className="p-2 text-slate-400 hover:text-white bg-dark-700/50 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Global Search */}
            <div className="hidden md:flex items-center bg-dark-900/50 border border-dark-600 rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all">
              <Search className="w-4 h-4 text-slate-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none text-sm text-slate-200 focus:outline-none w-full placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-brand-400 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.8)]"></span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-slate-400 hover:text-brand-400 relative transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-brand-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_8px_rgba(20,184,166,0.8)]">
                  {cartItemCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-dark-700">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-white">Martin Muraya</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-dark-700 border-2 border-brand-500/30 flex items-center justify-center overflow-hidden">
                <span className="text-brand-400 font-bold">MM</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}
