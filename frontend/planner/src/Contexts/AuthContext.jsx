import {createContext, useContext, useState} from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [initialized, setInitialized] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const keycloakData = {
        initialized,
        setInitialized,
        authenticated,
        setAuthenticated,
        loading,
        setLoading
    }

    return (
        <AuthContext.Provider value={keycloakData}>
            {children}
        </AuthContext.Provider>
    );
};

export function useSharedAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
