import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
// Create the context
const AuthContext = createContext(undefined);
// The main Auth Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
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
            }
            catch (error) {
                console.error('Error loading saved auth:', error);
                // Clear corrupted data
                localStorage.removeItem('recruit_auth_token');
                localStorage.removeItem('recruit_user');
            }
            finally {
                setIsLoading(false);
            }
        };
        loadSavedAuth();
    }, []);
    // Login function - calls your AWS backend
    const login = async (email, password) => {
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
            }
            else {
                throw new Error(response.message || 'Login failed');
            }
        }
        catch (error) {
            console.error('Login failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
        }
        finally {
            setIsLoading(false);
        }
    };
    // Register function - calls your AWS backend
    const register = async (email, password, role, firstName, lastName, companyName) => {
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
            }
            else {
                throw new Error(response.message || 'Registration failed');
            }
        }
        catch (error) {
            console.error('Registration failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    // Resume upload and parse function (Step 1)
    const uploadResumeAndParse = async (email, password, role, resumeFile) => {
        setIsLoading(true);
        try {
            const response = await authAPI.uploadResumeAndParse(email, password, role, resumeFile);
            if (response.success) {
                return {
                    sessionId: response.data.sessionId,
                    parsedData: response.data.parsedData
                };
            }
            else {
                throw new Error(response.message || 'Resume parsing failed');
            }
        }
        catch (error) {
            console.error('Resume upload failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Resume upload failed. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    // Confirm registration function (Step 2)
    const confirmRegistration = async (sessionId, parsedData) => {
        setIsLoading(true);
        try {
            const response = await authAPI.confirmRegistration(sessionId, parsedData);
            if (response.success) {
                // Store the data
                setUser(response.data.user);
                setToken(response.data.token);
                // Save to localStorage
                localStorage.setItem('recruit_auth_token', response.data.token);
                localStorage.setItem('recruit_user', JSON.stringify(response.data.user));
            }
            else {
                throw new Error(response.message || 'Registration confirmation failed');
            }
        }
        catch (error) {
            console.error('Registration confirmation failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Registration confirmation failed. Please try again.');
        }
        finally {
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
    const updateUser = (userData) => {
        if (user) {
            const updatedUser = Object.assign(Object.assign({}, user), userData);
            setUser(updatedUser);
            localStorage.setItem('recruit_user', JSON.stringify(updatedUser));
        }
    };
    // The value that will be provided to all components
    const value = {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        uploadResumeAndParse,
        confirmRegistration
    };
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
};
// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
