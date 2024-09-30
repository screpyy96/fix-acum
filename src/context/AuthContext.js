"use client"

import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importul corectat pentru versiunile noi

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
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
          dispatch({
            type: 'LOGIN',
            payload: { user: decoded, token },
          });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = ({ token, user }) => {
    console.log('Logging in with token:', token);
    console.log('User data:', user);
    localStorage.setItem('token', token);
    dispatch({
      type: 'LOGIN',
      payload: { user, token },
    });
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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