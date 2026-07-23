import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from '../../../lib/axios';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Activity,
  PackageSearch,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('7d');

  // Fetch Stats dynamically every 10 seconds
  const { data: statsData, isLoading: isLoadingStats, isError: isErrorStats } = useQuery({
    queryKey: ['dashboard-stats', timeRange],
    queryFn: async () => {
      const response = await axios.get('/dashboard/stats');
      return response.data;
    },
    refetchInterval: 10000, // Real-time polling
  });

  // Fetch Recent Orders dynamically every 10 seconds
  const { data: recentOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const response = await axios.get('/dashboard/recent-orders');
      return response.data;
    },
    refetchInterval: 10000,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
    }
  };

  const stats = [
    { 
      title: 'Total Revenue', 
      value: statsData?.totalRevenue?.value || '$0.00', 
      trend: statsData?.totalRevenue?.trend || 'up', 
      percentage: statsData?.totalRevenue?.percentage || '0%', 
      icon: DollarSign 
    },
    { 
      title: 'Active Orders', 
      value: statsData?.activeOrders?.value || '0', 
      trend: statsData?.activeOrders?.trend || 'up', 
      percentage: statsData?.activeOrders?.percentage || '0%', 
      icon: ShoppingCart 
    },
    { 
      title: 'New Customers', 
      value: statsData?.newCustomers?.value || '0', 
      trend: statsData?.newCustomers?.trend || 'down', 
      percentage: statsData?.newCustomers?.percentage || '0%', 
      icon: Users 
    },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1">Overview</h1>
          <p className="text-slate-400">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex bg-dark-800 p-1 rounded-lg border border-dark-700">
          {['24h', '7d', '30d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                timeRange === range 
                  ? 'bg-brand-500 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {isErrorStats && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>Failed to load real-time dashboard data. Ensure the backend API is running.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants} className="glass-panel p-6 group hover:border-brand-500/30 transition-colors duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center text-brand-400 border border-dark-600 shadow-inner group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-colors">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                stat.trend === 'down' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : stat.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                <span>{stat.percentage}</span>
              </div>
            </div>
            {isLoadingStats ? (
              <div className="h-8 w-24 bg-dark-700 animate-pulse rounded mb-2"></div>
            ) : (
              <h3 className="text-3xl font-display font-bold text-white mb-1">{stat.value}</h3>
            )}
            <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Placeholder */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Revenue Analytics</h3>
            <select className="bg-dark-900 border border-dark-600 text-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand-500">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-dark-600 rounded-xl bg-dark-800/50 min-h-[300px]">
            <div className="text-center">
              <Activity className="w-10 h-10 text-dark-500 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">Chart Visualization Area</p>
              <p className="text-sm text-slate-500 mt-1">Real-time data visualization will appear here.</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div variants={itemVariants} className="glass-panel flex flex-col">
          <div className="p-6 border-b border-dark-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Recent Orders</h3>
            <button className="text-sm text-brand-400 hover:text-brand-300 font-medium">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoadingOrders ? (
              <div className="p-6 text-center text-slate-400 animate-pulse">Loading orders...</div>
            ) : recentOrders && recentOrders.length > 0 ? (
              <div className="divide-y divide-dark-700">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="p-4 hover:bg-dark-700/30 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-dark-900 border border-dark-600 flex items-center justify-center">
                        <PackageSearch className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{order.id}</p>
                        <p className="text-xs text-slate-400">{order.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">{order.amount}</p>
                      <p className={`text-xs font-medium ${
                        order.status === 'Completed' ? 'text-emerald-400' :
                        order.status === 'Pending' ? 'text-amber-400' : 'text-slate-400'
                      }`}>{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500">No orders found.</div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
