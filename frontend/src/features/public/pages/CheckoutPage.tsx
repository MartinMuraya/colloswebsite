import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/axios';
import { clearCart } from '../../../store/slices/cartSlice';

const CheckoutPage: React.FC = () => {
  const { items, totalAmount } = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Cart is Empty</h2>
        <button onClick={() => navigate('/products')} className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition">
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatusMessage('Creating order...');

    try {
      const orderRes = await api.post('/orders', {
        customer_name: customerName,
        customer_phone: customerPhone,
        total_amount: totalAmount,
        items: items
      });
      const orderRef = orderRes.data.order.reference;

      setStatusMessage('Sending prompt to your phone...');
      await api.post('/payments/mpesa/stk-push', {
        phone_number: customerPhone,
        amount: totalAmount,
        order_reference: orderRef
      });

      setStatusMessage('Waiting for payment confirmation...');
      pollPaymentStatus(orderRef);
      
    } catch (error: any) {
      console.error(error);
      setStatusMessage(error.response?.data?.error || 'Checkout failed.');
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = (orderRef: string) => {
    let attempts = 0;
    const maxAttempts = 12; // 1 minute max polling

    const interval = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(interval);
        setStatusMessage('Payment timeout. Please check your messages.');
        setIsProcessing(false);
        return;
      }

      try {
        const res = await api.get(`/orders/${orderRef}`);
        const status = res.data.order.status;

        if (status === 'paid') {
          clearInterval(interval);
          setStatusMessage('Payment Successful!');
          dispatch(clearCart());
          setTimeout(() => navigate('/customer-dashboard'), 2000);
        } else if (status === 'failed') {
          clearInterval(interval);
          setStatusMessage('Payment Failed. Please try again.');
          setIsProcessing(false);
        }
      } catch (e) {
        console.error('Polling error', e);
      }
    }, 5000); 
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Order Summary</h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item: any) => (
              <li key={item.id} className="py-3 flex justify-between text-gray-600 dark:text-gray-300">
                <span>{item.name} <span className="text-sm text-gray-400">x {item.quantity}</span></span>
                <span className="font-medium text-gray-900 dark:text-white">KES {item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
             <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
             <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">KES {totalAmount}</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Payment Details</h2>
          <form onSubmit={handleCheckout} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md p-2.5 focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">M-Pesa Phone Number</label>
              <input required type="text" placeholder="254700000000" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md p-2.5 focus:ring-2 focus:ring-green-500" />
              <p className="text-xs text-gray-500 mt-1">A payment prompt will be sent to this number.</p>
            </div>
            
            <button type="submit" disabled={isProcessing} className={`w-full text-white p-3 rounded-md font-bold transition shadow-sm ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4CAF50] hover:bg-[#45a049]'}`}>
              {isProcessing ? (
                 <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {statusMessage}
                 </span>
              ) : 'Pay with M-Pesa'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
