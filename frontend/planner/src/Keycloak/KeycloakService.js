import keycloak from './Keycloak.js';

class KeycloakService {
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

    async updateToken(minValidity = 30) {
        try {
            const refreshed = await keycloak.updateToken(minValidity);
            if (refreshed) {
                console.log('Token refreshed');
            }
            return keycloak.token;
        } catch (error) {
            console.error('Failed to refresh token', error);
            throw error;
        }
    }

    login() {
        keycloak.login();
    }

    logout() {
        keycloak.logout({
            redirectUri: window.location.origin
        });
    }

    register() {
        keycloak.register();
    }
}

export default new KeycloakService();