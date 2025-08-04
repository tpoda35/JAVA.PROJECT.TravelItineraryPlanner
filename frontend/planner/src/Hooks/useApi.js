import ApiService from '../services/ApiService.js';

export const useApi = () => {
    const executeRequest = async (requestFn) => {
        try {
            return await requestFn();
        } catch (err) {
            throw err;
        }
    };

    const get = async (endpoint) => {
        return executeRequest(() => ApiService.get(endpoint));
    };

    const post = async (endpoint, data) => {
        return executeRequest(() => ApiService.post(endpoint, data));
    };

    const patch = async (endpoint, data) => {
        return executeRequest(() => ApiService.patch(endpoint, data));
    };

    const del = async (endpoint) => {
        return executeRequest(() => ApiService.delete(endpoint));
    };

    return {
        get,
        post,
        patch,
        delete: del
    };
};