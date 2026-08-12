import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  Menu, 
  Zap,
  CreditCard,
  Shield,
  Image as ImageIcon,
  LogOut,
  Globe,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import api from '../../lib/axios';
import { useTheme } from '../../contexts/ThemeContext';

export default function AdminLayout() {
  const [isSidebarOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<{id: number, text: string}[]>([
    { id: 1, text: 'Welcome to Collos Admin Panel 🚀' }
  ]);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [user] = useState<any>(() => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  });
  const isSuperAdmin = user?.role_names?.includes('Super Admin');

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', show: true },
    { name: 'Products', icon: Package, path: '/dashboard/catalog', show: true },
    { name: 'Services', icon: Package, path: '/dashboard/services', show: true },
    { name: 'Customers', icon: Users, path: '/dashboard/customers', show: true },
    { name: 'Payments', icon: CreditCard, path: '/dashboard/payments', show: true },
    { name: 'User Roles', icon: Shield, path: '/dashboard/users', show: isSuperAdmin },
    { name: 'Content', icon: ImageIcon, path: '/dashboard/content', show: isSuperAdmin },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings', show: true },
  ].filter(item => item.show);

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
          x: isMobileOpen ? 0 : (isMobile ? -260 : 0)
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
              {isSuperAdmin ? 'Super Admin' : 'Admin'}
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
              onClick={() => isMobile && setMobileOpen(false)}
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

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-blue-500/30 flex items-center justify-center overflow-hidden shrink-0">
              {user?.profile_picture ? (
                <img src={user.profile_picture} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                  {user?.name?.substring(0, 2).toUpperCase() || 'A'}
                </span>
              )}
            </div>
            <motion.div 
              animate={{ opacity: isSidebarOpen ? 1 : 0, display: isSidebarOpen ? 'block' : 'none' }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email}</p>
            </motion.div>
          </div>
          <motion.button
            animate={{ opacity: isSidebarOpen ? 1 : 0, display: isSidebarOpen ? 'flex' : 'none' }}
            onClick={async () => {
              try {
                await api.post('/auth/logout');
              } catch (e) {
                console.error(e);
              }
              localStorage.removeItem('user');
              localStorage.removeItem('auth_token');
              window.location.href = '/login';
            }}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Top Navbar */}
        <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10 shadow-sm transition-colors">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="lg:hidden font-semibold text-gray-900 dark:text-white">Admin Dashboard</span>
          </div>

          <div className="flex items-center gap-3 ml-auto relative">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link 
              to="/" 
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-xl transition-colors"
            >
              <Globe className="w-4 h-4" />
              View Public Site
            </Link>
            
            {/* Interactive Notification Button & Popover */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-12 right-0 w-72 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                      <h3 className="text-gray-900 dark:text-white font-medium text-sm">Notifications</h3>
                      {notifications.length > 0 && (
                        <button onClick={() => setNotifications([])} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Clear all</button>
                      )}
                    </div>
                    <div className="p-2 max-h-[300px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div key={notif.id} className="p-3 mb-2 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/30 flex justify-between items-start gap-3 relative group">
                            <p className="text-sm text-gray-700 dark:text-gray-300">{notif.text}</p>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center">
                          <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
                          No new notifications
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar & Click Dropdown */}
            {user && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-blue-500/30 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-500"
                  title={user?.name}
                >
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {user?.name?.substring(0, 2).toUpperCase() || 'A'}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full mt-2 right-0 z-50"
                    >
                      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl rounded-xl w-56 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        </div>
                        <div className="p-2 space-y-1">
                          <Link 
                            to="/"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 dark:hover:text-blue-400 rounded-lg transition-colors"
                          >
                            <Globe className="w-4 h-4" /> View Storefront
                          </Link>
                          <Link 
                            to="/dashboard/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 dark:hover:text-blue-400 rounded-lg transition-colors"
                          >
                            <Settings className="w-4 h-4" /> Admin Settings
                          </Link>
                        </div>
                        <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                          <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-3">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Direct Desktop Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-xl transition-all border border-red-200 dark:border-red-900/30 shadow-sm"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}

            {/* Mobile View Site Link */}
            <Link 
              to="/" 
              className="md:hidden p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <Globe className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-gray-900 flex flex-col">
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="py-6 px-4 md:px-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center md:text-left shrink-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                &copy; {new Date().getFullYear()} Collos Hardware. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</Link>
                <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</Link>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
