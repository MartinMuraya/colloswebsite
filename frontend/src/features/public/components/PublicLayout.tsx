import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Mail, Phone, MapPin, Sun, Moon, ShoppingCart, Bell, LogOut, ChevronDown, LayoutDashboard, ShoppingBag, Settings as SettingsIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import api from '../../../lib/axios';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store';
import { toggleCart } from '../../../store/slices/cartSlice';
import CartDrawer from '../../catalog/components/CartDrawer';

export default function PublicLayout() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{id: number, text: string}[]>([
    { id: 1, text: 'Welcome back! Checkout our new features. 🚀' }
  ]);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications([]);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);
  const [user, setUser] = useState<any>(null);

  const { data: productCategories } = useQuery({
    queryKey: ['public-product-categories'],
    queryFn: async () => {
      const res = await api.get('/catalog/categories/published');
      return res.data;
    }
  });

  const { data: serviceCategories } = useQuery({
    queryKey: ['public-service-categories'],
    queryFn: async () => {
      const res = await api.get('/services/categories/published');
      return res.data;
    }
  });

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Failed to parse user session');
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUser(null);
    window.location.href = '/login';
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  if (user) {
    const isAdmin = user.role_names?.includes('Super Admin') || user.role_names?.includes('Admin');
    navigation.push({ name: 'Dashboard', href: isAdmin ? '/dashboard' : '/customer-dashboard' });
  }

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-900 transition-colors">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center gap-2 w-48">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Rada bro..mali ni yako!!usiwe na wasiswasi.</span>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center justify-center flex-1 gap-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className={`flex items-center gap-1 text-sm font-semibold transition-all hover:text-blue-600 py-6 ${isActive(item.href) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}
                  >
                    {item.name}
                    {(item.name === 'Products' || item.name === 'Services') && (
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>

                  {(item.name === 'Products' || item.name === 'Services') && (
                    <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[250px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="p-3">
                        <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3 pt-2">
                          {item.name === 'Products' ? 'Product Categories' : 'Service Categories'}
                        </div>
                        <div className="flex flex-col">
                          {item.name === 'Products' && productCategories?.data?.slice(0, 6).map((cat: any) => (
                            <Link 
                              key={cat.id} 
                              to={`/products?category=${cat.slug}`}
                              className="px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 transition-colors"
                            >
                              {cat.name}
                            </Link>
                          ))}
                          
                          {item.name === 'Services' && serviceCategories?.data?.slice(0, 6).map((cat: any) => (
                            <Link 
                              key={cat.id} 
                              to={`/services?category=${cat.slug}`}
                              className="px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 transition-colors"
                            >
                              {cat.name}
                            </Link>
                          ))}

                          <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                          <Link
                            to={item.href}
                            className="px-3 py-2.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors flex justify-between items-center"
                          >
                            View All {item.name}
                            <span className="text-lg leading-none">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Controls - Right */}
            <div className="hidden md:flex items-center justify-end w-auto gap-4 relative">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 relative transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-14 right-20 w-72 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
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
                                <p className="text-sm text-gray-700 dark:text-gray-300 pr-4">{notif.text}</p>
                                <button 
                                  onClick={() => setNotifications(notifications.filter(n => n.id !== notif.id))}
                                  className="absolute top-2 right-2 p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center">
                              <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
                              You're all caught up!
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => dispatch(toggleCart())}
                    className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 relative transition-colors mr-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_8px_rgba(59,130,246,0.8)]">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                  <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                    <div className="group relative cursor-pointer">
                      <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-blue-500/30 flex items-center justify-center overflow-hidden">
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                            {user.name?.substring(0, 2).toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      
                      {/* Enhanced Profile Dropdown */}
                      <div className="absolute top-9 right-0 hidden group-hover:block pt-2">
                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-xl w-56 z-50 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                          </div>
                          <div className="p-2 space-y-1">
                            <Link 
                              to={user?.role_names?.some((r: string) => ['Super Admin', 'Admin', 'Staff'].includes(r)) ? '/dashboard' : '/customer-dashboard'}
                              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 dark:hover:text-blue-400 rounded-lg transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </Link>
                            <Link 
                              to="/customer-dashboard?tab=orders"
                              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 dark:hover:text-blue-400 rounded-lg transition-colors"
                            >
                              <ShoppingBag className="w-4 h-4" /> My Orders
                            </Link>
                            <Link 
                              to="/customer-dashboard?tab=settings"
                              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 dark:hover:text-blue-400 rounded-lg transition-colors"
                            >
                              <SettingsIcon className="w-4 h-4" /> Settings
                            </Link>
                          </div>
                          <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-3">
                              <LogOut className="w-4 h-4" /> Logout
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => dispatch(toggleCart())}
                className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_8px_rgba(59,130,246,0.8)]">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 top-[73px] bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40 md:hidden"
              />
              
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="absolute top-[100%] left-0 w-full z-50 md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-xl"
              >
              <div className="px-4 py-4 space-y-2">
                {user && (
                  <Link
                    to={user?.role_names?.some((r: string) => ['Super Admin', 'Admin', 'Staff'].includes(r)) ? '/dashboard' : '/customer-dashboard'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl mb-4"
                  >
                    Go to Dashboard
                  </Link>
                )}
                {navigation.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div 
                      onClick={(e) => {
                        if (item.name === 'Products' || item.name === 'Services') {
                          e.preventDefault();
                          setExpandedMobile(expandedMobile === item.name ? null : item.name);
                        }
                      }}
                      className={`flex justify-between items-center px-4 py-3 rounded-xl transition-colors cursor-pointer ${isActive(item.href)
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}>
                      {item.name === 'Products' || item.name === 'Services' ? (
                        <span className={`text-base font-semibold flex-1 ${isActive(item.href) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>
                          {item.name}
                        </span>
                      ) : (
                        <Link
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`text-base font-semibold flex-1 ${isActive(item.href) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}
                        >
                          {item.name}
                        </Link>
                      )}
                      {(item.name === 'Products' || item.name === 'Services') && (
                        <button 
                          className="p-1 rounded-md text-gray-500 pointer-events-none"
                        >
                          <ChevronDown className={`w-5 h-5 transition-transform ${expandedMobile === item.name ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {expandedMobile === item.name && (item.name === 'Products' || item.name === 'Services') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 ml-4 mb-2">
                            {item.name === 'Products' && (
                              <>
                                <Link
                                  to="/products"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-4 py-2 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                >
                                  View All Products &rarr;
                                </Link>
                                {productCategories?.data?.slice(0, 4).map((cat: any) => (
                                  <Link
                                    key={cat.id}
                                    to={`/products?category=${cat.slug}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 transition-colors"
                                  >
                                    {cat.name}
                                  </Link>
                                ))}
                              </>
                            )}
                            {item.name === 'Services' && (
                              <>
                                <Link
                                  to="/services"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-4 py-2 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                >
                                  View All Services &rarr;
                                </Link>
                                {serviceCategories?.data?.slice(0, 4).map((cat: any) => (
                                  <Link
                                    key={cat.id}
                                    to={`/services?category=${cat.slug}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 transition-colors"
                                  >
                                    {cat.name}
                                  </Link>
                                ))}
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-center px-4 py-3 rounded-xl text-base font-semibold text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Log Out
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full h-full max-w-full">
        <Outlet />

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 transition-colors mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <Link to="/" className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">Collos Hardware</span>
                </Link>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-6">
                  Your premier source for high-quality electrical and hardware supplies. Powering homes and industries with reliable components since 2010.
                </p>
                <div className="flex gap-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors font-bold text-xs">
                    FB
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors font-bold text-xs">
                    TW
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors font-bold text-xs">
                    IG
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link to="/products" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Products</Link></li>
                  <li><Link to="/services" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Services</Link></li>
                  <li><Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">About Us</Link></li>
                  <li><Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Contact Us</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Info</h3>
                <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>Murang'a County, <br />Murang'a Town, Kenya</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>+254 791 332310</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>www.gathongomartin@gmail.com</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Collos Hardware. All rights reserved.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
                <Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-blue-600">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <CartDrawer />
    </div>
  );
}
