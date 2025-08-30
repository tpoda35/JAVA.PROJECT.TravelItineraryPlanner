import {useContext, useEffect} from 'react';
import keycloak from '../Keycloak/Keycloak.js';
import KeycloakService from '../Services/KeycloakService.js';
import {AuthContext} from "../Contexts/AuthContext.jsx";

/**
 * React hook that initializes and manages Keycloak authentication state.
 *
 * Integrates with the global {@link AuthContext} to provide authentication status,
 * loading state, and initialization tracking. It automatically:
 *
 * - Initializes Keycloak on mount with SSO check (`onLoad: "check-sso"`)
 * - Uses PKCE (S256) for secure login
 * - Updates authentication state (`authenticated`, `initialized`, `loading`) in context
 * - Sets up a token refresh interval (every 5 minutes, if authenticated)
 *
 * This hook is **self-executing** (runs once on mount) and should be called
 * at the top level of your application (e.g., inside `App.jsx`) to establish Keycloak
 * before rendering protected routes or components.
 *
 * @returns {void} This hook does not return anything. It manages auth state via {@link AuthContext}.
 *
 * @example
 * // In App.jsx
 * import { AuthProvider } from "../Contexts/AuthContext";
 * import { useKeycloak } from "../Hooks/useKeycloak";
 *
 * function App() {
 *   useKeycloak(); // Initializes Keycloak once on app load
 *
 *   return (
 *     <AuthProvider>
 *       <Routes>
 *         <Route path="/dashboard" element={<Dashboard />} />
 *       </Routes>
 *     </AuthProvider>
 *   );
 * }
 */
export const useKeycloak = () => {
    const {
        setInitialized,
        setAuthenticated,
        setLoading
    } = useContext(AuthContext);

    useEffect(() => {
        const initKeycloak = async () => {
            try {
                setLoading(true);
                // 1. Initialize Keycloak with options:
                // - 'check-sso': Check if the user is already logged in (without forcing login)
                // - 'silentCheckSsoRedirectUri': URL used for silent SSO check via iframe
                // - 'pkceMethod': Use PKCE for better security with S256 hashing
                const isAuthenticated = await keycloak.init({
                    onLoad: 'check-sso',
                    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                    pkceMethod: 'S256',
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