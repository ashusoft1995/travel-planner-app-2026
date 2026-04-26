import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useFastRouting = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hydrated, isAdmin, isAgent } = useAuth();
  
  const getRedirectPath = (user, nextParam) => {
    // Priority order: next param > role-based default > fallback
    if (user?.role === 'admin' && (!nextParam || !nextParam.includes('/admin'))) {
      return '/admin/dashboard';
    }
    
    if (nextParam && nextParam.startsWith('/') && nextParam !== '/login' && nextParam !== '/signup') {
      return nextParam;
    }
    
    if (!user) return '/login';
    
    // Role-based routing
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'agent':
        return '/agent';
      case 'super_admin':
      case 'ashu':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  const redirectToDashboard = (user, nextParam = null) => {
    const redirectPath = getRedirectPath(user, nextParam);
    router.replace(redirectPath);
  };

  const handleLoginRedirect = (user, nextParam = null) => {
    const redirectPath = getRedirectPath(user, nextParam);
    
    // Add a small delay to ensure auth state is properly set
    setTimeout(() => {
      router.replace(redirectPath);
    }, 100);
  };

  const handleLogoutRedirect = () => {
    // Clear any stored redirect preferences
    localStorage.removeItem('redirectAfterLogin');
    router.replace('/login');
  };

  const saveRedirectPreference = (path) => {
    if (path && path.startsWith('/') && path !== '/login') {
      localStorage.setItem('redirectAfterLogin', path);
    }
  };

  const getSavedRedirect = () => {
    return localStorage.getItem('redirectAfterLogin');
  };

  const clearSavedRedirect = () => {
    localStorage.removeItem('redirectAfterLogin');
  };

  return {
    getRedirectPath,
    redirectToDashboard,
    handleLoginRedirect,
    handleLogoutRedirect,
    saveRedirectPreference,
    getSavedRedirect,
    clearSavedRedirect
  };
};

export default useFastRouting;
