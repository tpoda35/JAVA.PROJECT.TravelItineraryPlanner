import ApiService from '../services/ApiService.js';

/**
 * Custom React hook that provides a simple wrapper around the {@link ApiService}.
 * Exposes common HTTP methods (`get`, `post`, `patch`, `delete`) with unified error handling.
 *
 * Each method automatically wraps the underlying ApiService call in a try/catch
 * and rethrows the error for the caller to handle.
 *
 * @returns {{
 *   get: (endpoint: string) => Promise<any|undefined>,
 *   post: (endpoint: string, data?: any) => Promise<any|undefined>,
 *   patch: (endpoint: string, data?: any) => Promise<any|undefined>,
 *   delete: (endpoint: string) => Promise<any|undefined>
 * }} Object containing API helper methods
 *
 * @example
 * const { get, post } = useApi();
 *
 * // GET request
 * useEffect(() => {
 *   (async () => {
 *     try {
 *       const data = await get("/users");
 *       console.log(data);
 *     } catch (err) {
 *       console.error("Failed to fetch users:", err);
 *     }
 *   })();
 * }, []);
 *
 * @example
 * // POST request
 * const handleSubmit = async () => {
 *   try {
 *     await post("/users", { name: "Alice" });
 *   } catch (err) {
 *     console.error("Failed to create user:", err);
 *   }
 * };
 */

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