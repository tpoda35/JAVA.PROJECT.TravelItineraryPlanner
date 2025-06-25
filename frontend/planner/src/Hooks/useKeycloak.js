import {useContext, useEffect} from 'react';
import keycloak from '../Keycloak/Keycloak.js';
import KeycloakService from '../Services/KeycloakService.js';
import {AuthContext} from "../Contexts/AuthContext.jsx";

export const useKeycloak = () => {
    const {
        initialized,
        setInitialized,
        authenticated,
        setAuthenticated,
        loading,
        setLoading
    } = useContext(AuthContext);

    useEffect(() => {
        const initKeycloak = async () => {
            try {
                // 1. Initialize Keycloak with options:
                // - 'check-sso': Check if the user is already logged in (without forcing login)
                // - 'silentCheckSsoRedirectUri': URL used for silent SSO check via iframe
                // - 'pkceMethod': Use PKCE for better security with S256 hashing
                const isAuthenticated = await keycloak.init({
                    onLoad: 'check-sso',
                    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                    pkceMethod: 'S256'
                });

                // 2. Update state:
                // - Is user authenticated?
                setAuthenticated(isAuthenticated);
                // - Mark that Keycloak initialization has finished
                setInitialized(true);

                // 3. If the user is authenticated, set up a periodic token refresh:
                if (isAuthenticated) {
                    // Every 300,000ms (5 minutes), attempt to refresh token if expiring within 70 seconds
                    setInterval(async () => {
                        try {
                            await KeycloakService.updateToken(70);
                        } catch (error) {
                            console.error('Failed to refresh token:', error);
                        }
                    }, 300000);
                }
            } catch (error) {
                console.error('Keycloak initialization failed:', error);
                setInitialized(true);
            } finally {
                setLoading(false);
            }
        };

        // Run the async initialization function once on component mount
        initKeycloak();
    }, []);
};