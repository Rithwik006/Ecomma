import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const googleLogin = async () => {
    try {
      // 1. Sign in with Firebase popup
      const result = await signInWithPopup(auth, googleProvider);
      
      // 2. Get Firebase ID token
      const idToken = await result.user.getIdToken();
      
      // 3. Send to our backend to verify and issue app JWT
      const { data } = await axios.post('http://localhost:5000/api/auth/google', { idToken });
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/invalid-api-key') {
         return { success: false, message: 'Firebase credentials missing. Please set up your Firebase project.' };
      }
      return { success: false, message: error.response?.data?.message || error.message || 'Google Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
