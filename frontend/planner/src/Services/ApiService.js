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
    // Also throws an error with the messages from the backend.
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

            const contentType = response.headers.get('content-type');
            const isJson = contentType && contentType.includes('application/json');

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                if (isJson) {
                    const errorData = await response.json();
                    if (errorData?.message) {
                        errorMessage = errorData.message;
                    }
                }
                throw new Error(errorMessage);
            }

            if (isJson) {
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