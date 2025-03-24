
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { authState } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (authState.isAuthenticated && !authState.user?.isEmailVerified) {
      toast({
        title: "Email verification required",
        description: "Please verify your email to access all features.",
        variant: "destructive",
      });
    }
  }, [authState.isAuthenticated, authState.user?.isEmailVerified]);

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Email not verified - redirect to verification page
  if (!authState.user?.isEmailVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // All checks passed - render children
  return <>{children}</>;
};

export default AuthGuard;
