import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI, type User } from '../services/api';

// Define what the AuthContext provides
interface AuthContextType {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Functions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'candidate' | 'employer', firstName?: string, lastName?: string, companyName?: string) => Promise<void>;
  logout: () => void;
  
  // Utility
  updateUser: (userData: Partial<User>) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

// The main Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in
  const isAuthenticated = !!user && !!token;

  // Load saved login data when app starts
  useEffect(() => {
    const loadSavedAuth = () => {
      try {
        const savedToken = localStorage.getItem('recruit_auth_token');
        const savedUser = localStorage.getItem('recruit_user');
        
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading saved auth:', error);
        // Clear corrupted data
        localStorage.removeItem('recruit_auth_token');
        localStorage.removeItem('recruit_user');
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedAuth();
  }, []);

  // Login function - calls your AWS backend
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        // Store the data
        setUser(response.data.user);
        setToken(response.data.token);
        
        // Save to localStorage (survives page refresh)
        localStorage.setItem('recruit_auth_token', response.data.token);
        localStorage.setItem('recruit_user', JSON.stringify(response.data.user));
      } else {
        throw new Error(response.message || 'Login failed');
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Register function - calls your AWS backend
  const register = async (email: string, password: string, role: 'candidate' | 'employer', firstName?: string, lastName?: string, companyName?: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(email, password, role, firstName, lastName, companyName);
      
      if (response.success) {
        // Store the data
        setUser(response.data.user);
        setToken(response.data.token);
        
        // Save to localStorage
        localStorage.setItem('recruit_auth_token', response.data.token);
        localStorage.setItem('recruit_user', JSON.stringify(response.data.user));
      } else {
        throw new Error(response.message || 'Registration failed');
      }
      
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('recruit_auth_token');
    localStorage.removeItem('recruit_user');
  };

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('recruit_user', JSON.stringify(updatedUser));
    }
  };

  // The value that will be provided to all components
  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 