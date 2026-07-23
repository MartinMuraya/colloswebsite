import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../../../lib/axios';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const success = searchParams.get('success');
    
    if (success === '1') {
      // In a real app, you might want to fetch the user profile here using /api/user
      // For now we'll just redirect to dashboard since the HTTP-only cookie is set
      navigate('/dashboard');
    } else {
      // Failed to authenticate
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-medium text-slate-200">Completing Sign In...</h2>
      </div>
    </div>
  );
}
