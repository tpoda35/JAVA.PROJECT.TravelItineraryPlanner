import keycloak from '../keycloak/Keycloak.js';
import KeycloakService from './KeycloakService.js';

class ApiService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_BASE_URL;
    }

    // Updates the keycloak jwt token and sets the header.
    async getHeaders() {
        try {
            await KeycloakService.updateToken(30);
            console.log('Current token:', keycloak.token);
            return {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${keycloak.token}`
            };
        } catch (error) {
            console.error('Failed to get auth headers:', error);
            throw new Error('Authentication failed');
        }
    }

    // Gets the default header (jwt, content-type),
    // sets the url and the provided header options with the options param.
    async request(endpoint, options = {}) {
        try {
            const headers = await this.getHeaders();
            const url = `${this.baseURL}${endpoint}`;

            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }

            return response;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint, {
            method: 'GET'
        });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async patch(endpoint) {
        return this.request(endpoint, {
            method: 'PATCH'
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

export default new ApiService();