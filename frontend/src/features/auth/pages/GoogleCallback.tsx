import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const success = searchParams.get('success');
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    
    if (success === '1' && token && userStr) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', userStr);
      
      const userObj = JSON.parse(userStr);
      // Determine redirection based on roles
      if (userObj.role_names?.includes('Super Admin') || userObj.role_names?.includes('Admin')) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } else {
      // Failed to authenticate
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-900 dark:text-slate-200">Completing Sign In...</h2>
      </div>
    </div>
  );
}
