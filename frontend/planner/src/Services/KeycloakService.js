import keycloak from '../Keycloak/Keycloak.js';

const tokenRefreshThreshold = Number(import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD_SECONDS);
const tokenRefreshListeners = new Set();

/**
 * A utility wrapper around the Keycloak instance that:
 * - Handles token refresh and listener notifications
 * - Provides user info access
 * - Simplifies login, logout, and registration
 *
 *  Automatically uses the `VITE_TOKEN_REFRESH_THRESHOLD_SECONDS` environment variable
 *  as the default minimum validity for token refresh.
 */
class KeycloakService {
    onTokenRefresh(callback) {
        tokenRefreshListeners.add(callback);
        return () => tokenRefreshListeners.delete(callback);
    }

    async updateToken(minValidity = tokenRefreshThreshold) {
        try {
            const refreshed = await keycloak.updateToken(minValidity);
            if (refreshed) {
                console.log('Token refreshed');
                // Notify listeners
                tokenRefreshListeners.forEach(cb => cb(keycloak.token));
            }
            return keycloak.token;
        } catch (error) {
            console.error('Failed to refresh token', error);
            throw error;
        }
    }

    getUserInfo() {
        if (keycloak.tokenParsed) {
            return {
                id: keycloak.tokenParsed.sub,
                username: keycloak.tokenParsed.preferred_username,
                email: keycloak.tokenParsed.email,
                firstName: keycloak.tokenParsed.given_name,
                lastName: keycloak.tokenParsed.family_name,
                roles: keycloak.tokenParsed.realm_access?.roles || []
            };
        }
        return null;
    }

    login() {
        keycloak.login();
    }

    logout() {
        keycloak.logout({ redirectUri: window.location.origin });
    }

    register() {
        keycloak.register();
    }
}

export default new KeycloakService();
