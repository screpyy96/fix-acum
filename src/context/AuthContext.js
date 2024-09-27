"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Aici puteți verifica dacă utilizatorul este autentificat
    // de exemplu, verificând un token stocat în localStorage
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Verificați token-ul cu backend-ul
        // Dacă este valid, dispatch({ type: 'LOGIN', payload: userData });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);