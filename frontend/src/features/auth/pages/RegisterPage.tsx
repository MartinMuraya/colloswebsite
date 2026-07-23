import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User, ArrowRight, Activity, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../../../lib/axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      // 1. Get CSRF cookie
      await api.get('/sanctum/csrf-cookie');
      
      // 2. Register
      await api.post('/auth/register', { name, email, password });
      
      // 3. Immediately Login
      const loginResponse = await api.post('/auth/login', { email, password });
      
      return loginResponse.data;
    },
    onSuccess: (data) => {
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    mutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-900">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-400 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main Glass Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel w-full max-w-md p-8 md:p-10 z-10 mx-4"
      >
        <div className="flex justify-center mb-8">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.3)]"
          >
            <Zap className="text-white w-8 h-8" />
          </motion.div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-slate-400 text-sm">Join the enterprise portal today.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-11" 
                placeholder="John Doe"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-11" 
                placeholder="admin@electrical.com"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-11" 
                placeholder="••••••••"
                required 
                minLength={8}
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full group mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Log in</Link>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
          <Activity className="w-4 h-4" />
          <span>Secure Enterprise Connection</span>
        </div>
      </motion.div>
    </div>
  );
}
