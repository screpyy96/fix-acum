"use client"

import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp < Date.now() / 1000) {
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT' });
          } else {
            const user = {
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
              type: decoded.type,
              trade: decoded.trade // Doar pentru worker
            };
            dispatch({
              type: 'LOGIN',
              payload: { user, token },
            });
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        loadUserFromStorage(); // Încercăm să încărcăm utilizatorul din localStorage
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
    router.push('/');
  };

  const updateUser = async (updateData) => {
    try {
      const settingsEndpoint = state.user.type === 'client' ? '/api/settings/client' : '/api/settings/worker';
      const response = await fetch(settingsEndpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const { client, worker, token } = await response.json();
      const updatedUser = client || worker;
      
      if (token) {
        localStorage.setItem('token', token);
      }

      dispatch({
        type: 'LOGIN',
        payload: { user: updatedUser, token },
      });

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const fetchUserSettings = async () => {
    if (state.user) {
      try {
        const settingsEndpoint = state.user.type === 'client' ? '/api/settings/client' : '/api/settings/worker';
        const response = await fetch(settingsEndpoint, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
        if (response.ok) {
          return await response.json();
        }
        throw new Error('Failed to fetch user settings');
      } catch (error) {
        console.error('Error fetching user settings:', error);
        throw error;
      }
    }
  };

  const loadUserFromStorage = () => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        dispatch({
          type: 'LOGIN',
          payload: { user, token },
        });
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
      }
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      logout, 
      updateUser,
      fetchUserSettings
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