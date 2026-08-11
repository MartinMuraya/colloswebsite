import React from 'react';
import { Navigate } from 'react-router-dom';

interface RequireRoleProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles, children }) => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    const userRoles = user.role_names || [];
    
    const hasRole = allowedRoles.some(role => userRoles.includes(role));
    
    if (!hasRole) {
      return <Navigate to="/" replace />; 
    }

    return <>{children}</>;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};

export default RequireRole;
