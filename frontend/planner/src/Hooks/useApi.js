import ApiService from "../services/ApiService.js";

/**
 * Custom React hook that provides a simple wrapper around the {@link ApiService}.
 * Exposes common HTTP methods (`get`, `post`, `patch`, `del`) with unified error handling.
 *
 * Each method automatically wraps the underlying ApiService call in a try/catch
 * and rethrows the error for the caller to handle.
 *
 * @returns {{
 *   get: (endpoint: string) => Promise<any|undefined>,
 *   post: (endpoint: string, data?: any) => Promise<any|undefined>,
 *   patch: (endpoint: string, data?: any) => Promise<any|undefined>,
 *   del: (endpoint: string) => Promise<any|undefined>
 * }} Object containing API helper methods
 *
 * @example
 * const { get, post, del } = useApi();
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
 *
 * @example
 * // DELETE request (via `del`)
 * const handleDelete = async () => {
 *   try {
 *     await del("/users/123");
 *   } catch (err) {
 *     console.error("Failed to delete user:", err);
 *   }
 * };
 */
export const useApi = () => {
    const executeRequest = async (method, endpoint, data) => {
        try {
            return await ApiService[method](endpoint, data);
        } catch (err) {
            throw err;
        }
    };

    return {
        get: (endpoint) => executeRequest("get", endpoint),
        post: (endpoint, data) => executeRequest("post", endpoint, data),
        patch: (endpoint, data) => executeRequest("patch", endpoint, data),
        del: (endpoint) => executeRequest("delete", endpoint),
    };
};
