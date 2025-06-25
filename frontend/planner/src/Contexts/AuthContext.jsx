import {createContext, useState} from 'react';

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
