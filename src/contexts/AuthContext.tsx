
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '@/types/news';
import { executeGraphqlQuery } from '@/utils/hasura-service';
import { toast } from '@/hooks/use-toast';

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null
};

type AuthContextType = {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    // Try to restore auth state from localStorage on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setAuthState({ ...initialAuthState, loading: false });
          return;
        }

        // Verify token and get user info
        const userQuery = `
          query GetCurrentUser {
            getCurrentUser {
              id
              email
              name
              isEmailVerified
              preferences {
                topics
                sources
                keywords
                excludeKeywords
              }
            }
          }
        `;

        const response = await executeGraphqlQuery(userQuery, {}, token);
        const user = response.data.getCurrentUser;

        if (user) {
          setAuthState({
            isAuthenticated: true,
            user,
            token,
            loading: false,
            error: null
          });
        } else {
          // Token is invalid or expired
          localStorage.removeItem('authToken');
          setAuthState({ ...initialAuthState, loading: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        setAuthState({ ...initialAuthState, loading: false, error: 'Authentication failed' });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const loginMutation = `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            user {
              id
              email
              name
              isEmailVerified
              preferences {
                topics
                sources
                keywords
                excludeKeywords
              }
            }
          }
        }
      `;

      const response = await executeGraphqlQuery(
        loginMutation, 
        { email: credentials.email, password: credentials.password }
      );

      const { token, user } = response.data.login;

      if (!user.isEmailVerified) {
        toast({
          title: "Email verification required",
          description: "Please verify your email before logging in. A verification link has been sent to your email.",
          variant: "destructive",
        });
        await sendVerificationEmail();
        setAuthState({ ...initialAuthState, loading: false });
        return;
      }

      localStorage.setItem('authToken', token);

      setAuthState({
        isAuthenticated: true,
        user,
        token,
        loading: false,
        error: null
      });

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name || user.email}!`,
      });
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Login failed. Please check your credentials.' 
      }));

      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const registerMutation = `
        mutation Register($email: String!, $password: String!, $name: String!) {
          register(email: $email, password: $password, name: $name) {
            success
            message
          }
        }
      `;

      const response = await executeGraphqlQuery(
        registerMutation, 
        { 
          email: credentials.email, 
          password: credentials.password, 
          name: credentials.name 
        }
      );

      if (response.data.register.success) {
        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account before logging in.",
        });
        
        setAuthState({ ...initialAuthState, loading: false });
      } else {
        throw new Error(response.data.register.message);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Registration failed. Please try again.' 
      }));

      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({ ...initialAuthState, loading: false });
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const verifyEmail = async (token: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const verifyEmailMutation = `
        mutation VerifyEmail($token: String!) {
          verifyEmail(token: $token) {
            success
            message
          }
        }
      `;

      const response = await executeGraphqlQuery(verifyEmailMutation, { token });

      if (response.data.verifyEmail.success) {
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified. You can now log in.",
        });
      } else {
        throw new Error(response.data.verifyEmail.message);
      }
    } catch (error) {
      console.error('Email verification failed:', error);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const sendVerificationEmail = async () => {
    try {
      const email = authState.user?.email;
      if (!email) return;

      const sendVerificationEmailMutation = `
        mutation SendVerificationEmail($email: String!) {
          sendVerificationEmail(email: $email) {
            success
            message
          }
        }
      `;

      const response = await executeGraphqlQuery(
        sendVerificationEmailMutation, 
        { email },
        authState.token || undefined
      );

      if (response.data.sendVerificationEmail.success) {
        toast({
          title: "Verification Email Sent",
          description: "Please check your email for the verification link.",
        });
      } else {
        throw new Error(response.data.sendVerificationEmail.message);
      }
    } catch (error) {
      console.error('Sending verification email failed:', error);
      toast({
        title: "Failed to Send Verification Email",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      authState, 
      login, 
      register, 
      logout,
      verifyEmail,
      sendVerificationEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
