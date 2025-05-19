/**
 * Auth Context
 * 
 * This module provides context for user authentication.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  login, 
  logout, 
  signup, 
  getProfile, 
  selectUser, 
  selectIsLoggedIn,
  selectUserStatus
} from '../store/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../services/logger';

// Create the context
export const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
  signup: () => {},
  checkAuth: () => {},
});

// Provider component
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userStatus = useSelector(selectUserStatus);
  
  // Load auth state on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        
        if (token && !isLoggedIn) {
          // If we have a token but user is not logged in, try to get profile
          dispatch(getProfile());
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      }
    };
    
    loadAuth();
  }, [dispatch, isLoggedIn]);
  
  // Log app launch
  useEffect(() => {
    logger.logAppLaunch(user?.email);
  }, [user]);
  
  // Login function
  const handleLogin = async (email, password) => {
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  // Signup function
  const handleSignup = async (email, password) => {
    try {
      const result = await dispatch(signup({ email, password })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  // Logout function
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  // Check auth function
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return !!token;
    } catch (error) {
      console.error('Error checking auth:', error);
      return false;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading: userStatus === 'loading',
        login: handleLogin,
        logout: handleLogout,
        signup: handleSignup,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);