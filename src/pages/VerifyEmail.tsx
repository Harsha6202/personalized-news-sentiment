
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mail } from 'lucide-react';
import FadeInSection from '@/components/ui-components/FadeInSection';
import Logo from '@/components/ui-components/Logo';

const VerifyEmail = () => {
  const { authState, sendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // If already verified, redirect to dashboard
    if (authState.isAuthenticated && authState.user?.isEmailVerified) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }

    // If not authenticated at all, redirect to login
    if (!authState.loading && !authState.isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [authState, navigate, location]);

  const handleResendVerification = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    try {
      await sendVerificationEmail();
      setCountdown(60); // 60 second cooldown
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setIsResending(false);
    }
  };

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-secondary/30">
      <FadeInSection delay={100}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Verify Your Email
          </h2>
        </div>
      </FadeInSection>

      <FadeInSection delay={300} className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            
            <div className="text-center space-y-3">
              <p className="text-lg font-medium">
                Check your inbox
              </p>
              <p className="text-muted-foreground">
                We've sent a verification link to{' '}
                <span className="font-medium text-foreground">
                  {authState.user?.email || 'your email address'}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Click the link in the email to verify your account and access all features.
              </p>
            </div>

            <div className="pt-4 border-t w-full text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Didn't receive the email? Check your spam folder or:
              </p>
              <button
                onClick={handleResendVerification}
                disabled={isResending || countdown > 0}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <>
                    <span className="mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  'Resend verification email'
                )}
              </button>
            </div>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
};

export default VerifyEmail;
