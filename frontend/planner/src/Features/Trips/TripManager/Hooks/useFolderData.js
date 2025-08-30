import { useEffect, useState } from "react";
import { useApi } from "../../../../Hooks/useApi.js";
import { getErrorMessage } from "../../../../Utils/getErrorMessage.js";

export function useFolderData() {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const api = useApi();

    // This causes TripManagerContent to render 2 extra times.
    useEffect(() => {
        let isMounted = true;
        (async () => {
            setLoading(true);
            try {
                const response = await api.get('/folders');
                if (isMounted) setFolders(response || []);
            } catch (err) {
                if (isMounted) {
                    const errorMsg = getErrorMessage(err, 'Failed to load folders.');
                    setError(errorMsg);
                }
            } finally {
                setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, []);

    return {
        folders,
        setFolders,
        loading,
        setLoading,
        error,
        setError
    };
}