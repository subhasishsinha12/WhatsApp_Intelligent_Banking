import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  leads: [],
  tickets: [],
  customers: [],
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_LEADS':
      return { ...state, leads: action.payload };
    case 'SET_TICKETS':
      return { ...state, tickets: action.payload };
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_LEAD':
      return { ...state, leads: [action.payload, ...state.leads] };
    case 'UPDATE_LEAD':
      return { ...state, leads: state.leads.map(l => l.id === action.payload.id ? action.payload : l) };
    case 'UPDATE_TICKET':
      return { ...state, tickets: state.tickets.map(t => t.id === action.payload.id ? action.payload : t) };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem('wb_user');
    const savedToken = localStorage.getItem('wb_token');
    if (savedUser && savedToken) {
      dispatch({ type: 'SET_USER', payload: { user: JSON.parse(savedUser), token: savedToken } });
    }
  }, []);

  const login = (user, token) => {
    localStorage.setItem('wb_user', JSON.stringify(user));
    localStorage.setItem('wb_token', token);
    dispatch({ type: 'SET_USER', payload: { user, token } });
  };

  const logout = () => {
    localStorage.removeItem('wb_user');
    localStorage.removeItem('wb_token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
