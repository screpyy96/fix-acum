"use client"

import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isClient: false,
  isWorker: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        isClient: action.payload.user.type === 'client',
        isWorker: action.payload.user.type === 'worker',
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isClient: false,
        isWorker: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            console.log('Token has expired');
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT' });
          } else {
            // Verifică dacă există date actualizate în baza de date
            const response = await fetch('/api/settings/client', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (response.ok) {
              const { client, token: newToken } = await response.json();
              if (newToken) {
                localStorage.setItem('token', newToken);
              }
              dispatch({
                type: 'LOGIN',
                payload: { user: client, token: newToken || token },
              });
            } else {
              dispatch({
                type: 'LOGIN',
                payload: { user: decoded, token },
              });
            }
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    initializeAuth();
  }, []);

  const login = ({ token, user }) => {
    localStorage.setItem('token', token);
    dispatch({
      type: 'LOGIN',
      payload: { user, token },
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = async (updateData) => {
    try {
      const response = await fetch('/api/settings/client', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const { client, token } = await response.json();
      
      if (token) {
        localStorage.setItem('token', token);
      }

      dispatch({
        type: 'LOGIN',
        payload: { user: client, token },
      });

      return client;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}