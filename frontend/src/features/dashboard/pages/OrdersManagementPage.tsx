import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/axios';
import { Loader2, Search } from 'lucide-react';

export default function OrdersManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: responseData, isLoading } = useQuery({
    queryKey: ['admin-orders', searchTerm],
    queryFn: async () => {
      const response = await api.get('/orders', { params: { search: searchTerm } });
      return response.data;
    }
  });

  const orders = responseData?.data || [];

  const getStatusBadge = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400',
      paid: 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400',
      shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400'
    };
    return (
      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-md ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1">Orders Management</h1>
          <p className="text-gray-500 dark:text-slate-400">Track and fulfill customer orders and M-Pesa payments.</p>
        </div>
      </div>

      <div className="glass-panel p-4 flex gap-4 items-center">
         <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search orders by reference or phone..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="input-field pl-10 w-full py-2 text-sm" 
            />
         </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-800/50 border-b border-gray-200 dark:border-dark-700 text-gray-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Phone (M-Pesa)</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-700/50 text-sm text-gray-700 dark:text-slate-300">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center p-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500" /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-12 text-gray-500">No orders found.</td></tr>
              ) : orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-dark-700/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-brand-600 dark:text-brand-400">{order.reference}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.customer_name}</td>
                  <td className="px-6 py-4 font-mono">{order.customer_phone}</td>
                  <td className="px-6 py-4 font-medium">KES {order.total_amount}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
