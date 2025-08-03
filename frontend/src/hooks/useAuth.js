import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Additional auth-related hooks
export const useAuthRedirect = () => {
  const { isAuthenticated, accountType } = useAuth();
  
  const getRedirectPath = () => {
    if (!isAuthenticated) {
      return '/login';
    }
    
    if (accountType === 'vendor') {
      return '/vendor/dashboard';
    }
    
    return '/user/dashboard';
  };

  return { getRedirectPath };
};

export const useRequireAuth = (requiredAccountType = null) => {
  const { isAuthenticated, accountType, isLoading } = useAuth();
  
  const isAuthorized = () => {
    if (!isAuthenticated) return false;
    if (requiredAccountType && accountType !== requiredAccountType) return false;
    return true;
  };

  return {
    isAuthenticated,
    isAuthorized: isAuthorized(),
    isLoading,
    accountType
  };
};

export default useAuth;