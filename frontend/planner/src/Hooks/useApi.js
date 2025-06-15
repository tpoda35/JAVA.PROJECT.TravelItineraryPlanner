import {useState} from 'react';
import ApiService from '../services/ApiService.js';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executeRequest = async (requestFn) => {
        setLoading(true);
        setError(null);

        try {
            return await requestFn();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
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
        loading,
        error,
        get,
        post,
        patch,
        delete: del
    };
};