import axios from 'axios';
import keycloak from '../keycloak/Keycloak.js';
import KeycloakService from './KeycloakService.js';
import {getErrorMessage} from "../Utils/getErrorMessage.js";

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
            await KeycloakService.updateToken(30);
            config.headers.Authorization = `Bearer ${keycloak.token}`;
            // console.log('Current token:', keycloak.token);
            return config;
        });
    }

    async request(config) {
        try {
            const response = await this.client.request(config);
            return response.data;
        } catch (err) {
            console.error('API Request failed:', err);
            let message = getErrorMessage(err, 'Api request failed.')
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
