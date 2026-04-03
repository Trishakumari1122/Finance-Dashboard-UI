'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { INITIAL_TRANSACTIONS } from '@/data/mockData';

const AppContext = createContext(null);

const initialState = {
    role: 'admin',
    theme: 'light',
    transactions: INITIAL_TRANSACTIONS,
    filters: {
        search: '',
        category: 'all',
        type: 'all',
        sortBy: 'date',
        sortOrder: 'desc',
    },
    sidebarOpen: false,
};

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_ROLE':
            return { ...state, role: action.payload };

        case 'TOGGLE_THEME':
            return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };

        case 'SET_THEME':
            return { ...state, theme: action.payload };

        case 'ADD_TRANSACTION':
            return { ...state, transactions: [...state.transactions, action.payload] };

        case 'EDIT_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.map(t =>
                    t.id === action.payload.id ? action.payload : t
                ),
            };

        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter(t => t.id !== action.payload),
            };

        case 'SET_FILTERS':
            return { ...state, filters: { ...state.filters, ...action.payload } };

        case 'RESET_FILTERS':
            return { ...state, filters: initialState.filters };

        case 'TOGGLE_SIDEBAR':
            return { ...state, sidebarOpen: !state.sidebarOpen };

        case 'CLOSE_SIDEBAR':
            return { ...state, sidebarOpen: false };

        case 'LOAD_STATE':
            return { ...state, ...action.payload };

        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // on mount, try loading any saved data from localStorage
    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('finance-theme');
            const savedTransactions = localStorage.getItem('finance-transactions');
            const savedRole = localStorage.getItem('finance-role');

            const loadPayload = {};
            if (savedTheme) loadPayload.theme = savedTheme;
            if (savedRole) loadPayload.role = savedRole;
            if (savedTransactions) {
                loadPayload.transactions = JSON.parse(savedTransactions);
            }

            if (Object.keys(loadPayload).length > 0) {
                dispatch({ type: 'LOAD_STATE', payload: loadPayload });
            }
        } catch (e) {
            console.warn('Could not load saved state:', e);
        }
    }, []);

    // save to localStorage whenever these change
    useEffect(() => {
        localStorage.setItem('finance-theme', state.theme);
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state.theme]);

    useEffect(() => {
        localStorage.setItem('finance-transactions', JSON.stringify(state.transactions));
    }, [state.transactions]);

    useEffect(() => {
        localStorage.setItem('finance-role', state.role);
    }, [state.role]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}
