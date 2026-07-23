import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../../../lib/axios';

export default function VerifyEmailPage() {
  const { id, hash } = useParams<{ id: string; hash: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.post(`/auth/email/verify/${id}/${hash}`);
        setStatus('success');
        setMessage('Email verified successfully! Redirecting...');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Failed to verify email. The link might be expired or invalid.');
      }
    };

    if (id && hash) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link.');
    }
  }, [id, hash, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 max-w-md w-full mx-4 text-center"
      >
        <div className="flex justify-center mb-6">
          {status === 'loading' && <Loader2 className="w-16 h-16 text-brand-500 animate-spin" />}
          {status === 'success' && <CheckCircle2 className="w-16 h-16 text-emerald-500" />}
          {status === 'error' && <XCircle className="w-16 h-16 text-red-500" />}
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          {status === 'loading' && 'Verifying Email'}
          {status === 'success' && 'Verified!'}
          {status === 'error' && 'Verification Failed'}
        </h2>
        
        <p className="text-slate-400 mb-8">{message}</p>

        {status === 'error' && (
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary w-full"
          >
            Return to Login
          </button>
        )}
      </motion.div>
    </div>
  );
}
