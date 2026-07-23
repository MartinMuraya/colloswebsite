import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: '$128,430', change: '+12.5%', trend: 'up', icon: DollarSign },
  { label: 'Active Orders', value: '45', change: '+5.2%', trend: 'up', icon: Package },
  { label: 'New Customers', value: '1,204', change: '-2.4%', trend: 'down', icon: Users },
  { label: 'System Health', value: '99.9%', change: 'Stable', trend: 'neutral', icon: Activity },
];

const recentOrders = [
  { id: 'ORD-7829', customer: 'Acme Corp', status: 'Processing', amount: '$4,250.00', date: '2 mins ago' },
  { id: 'ORD-7828', customer: 'Stark Industries', status: 'Shipped', amount: '$12,400.00', date: '1 hour ago' },
  { id: 'ORD-7827', customer: 'Wayne Enterprises', status: 'Delivered', amount: '$850.00', date: '3 hours ago' },
  { id: 'ORD-7826', customer: 'Globex Corp', status: 'Pending', amount: '$2,100.00', date: '5 hours ago' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
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

export default function DashboardPage() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome back! Here's what's happening today.</p>
        </div>
        <button className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants} className="glass-panel p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center text-brand-400 border border-dark-600 shadow-inner">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                stat.trend === 'down' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
              }`}>
                {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3 mr-1" />}
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Main Chart Area (Placeholder) */}
        <motion.div variants={itemVariants} className="glass-panel p-6 lg:col-span-2 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue Analytics</h3>
            <select className="bg-dark-900 border border-dark-600 text-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand-500">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-dark-600 rounded-xl bg-dark-800/50">
            <div className="text-center">
              <Activity className="w-10 h-10 text-dark-500 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Chart visualization will render here</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Orders List */}
        <motion.div variants={itemVariants} className="glass-panel p-0 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-dark-700">
            <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
          </div>
          <div className="divide-y divide-dark-700/50 overflow-y-auto">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-dark-700/30 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-slate-200 group-hover:text-brand-400 transition-colors">{order.id}</p>
                    <p className="text-sm text-slate-400">{order.customer}</p>
                  </div>
                  <span className="text-sm font-bold text-white">{order.amount}</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-3">
                  <span className={`px-2 py-1 rounded-md font-medium ${
                    order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' :
                    order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                    order.status === 'Processing' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-slate-500">{order.date}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-dark-700 mt-auto bg-dark-800/50 text-center">
            <a href="#" className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">View All Orders</a>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
