import axios from 'axios';
import keycloak from '../keycloak/Keycloak.js';
import KeycloakService from './KeycloakService.js';
import { getErrorMessage } from "../Utils/getErrorMessage.js";

/**
 * A wrapper around Axios that:
 * - Automatically attaches a Keycloak access token to each request
 * - Normalizes error handling with `getErrorMessage`
 * - Exposes convenience methods for standard HTTP verbs
 *
 * Requests are made relative to the base URL defined in `VITE_API_BASE_URL`.
 *
 * Use it with useApi hook.
 */

class ApiService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_BASE_URL;

        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        this.client.interceptors.request.use(async (config) => {
            await KeycloakService.updateToken();
            config.headers.Authorization = `Bearer ${keycloak.token}`;
            return config;
        });
    }

    async request(config) {
        try {
            const response = await this.client.request(config);
            return response.data;
        } catch (err) {
            console.error('API Request failed:', err);
            let message = getErrorMessage(err, 'Api request failed.');
            throw new Error(message);
        }
    }

    get(endpoint) {
        return this.request({ method: 'GET', url: endpoint });
    }

    post(endpoint, data) {
        return this.request({ method: 'POST', url: endpoint, data });
    }

    patch(endpoint, data) {
        return this.request({ method: 'PATCH', url: endpoint, data });
    }

    delete(endpoint) {
        return this.request({ method: 'DELETE', url: endpoint });
    }
}

export default new ApiService();
