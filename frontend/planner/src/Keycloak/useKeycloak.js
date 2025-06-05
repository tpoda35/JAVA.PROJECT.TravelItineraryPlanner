import { useState, useEffect } from 'react';
import keycloak from '../keycloak/Keycloak.js';
import KeycloakService from '../keycloak/KeycloakService.js';

export const useKeycloak = () => {
    const [initialized, setInitialized] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initKeycloak = async () => {
            try {
                const isAuthenticated = await keycloak.init({
                    onLoad: 'check-sso',
                    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                    pkceMethod: 'S256'
                });

                setAuthenticated(isAuthenticated);
                setInitialized(true);

                if (isAuthenticated) {
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

        initKeycloak();
    }, []);

    return {
        initialized,
        authenticated,
        loading,
        keycloakService: KeycloakService
    };
};