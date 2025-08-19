import { useState, useEffect } from 'react';
import { useApi } from '../../../../Hooks/useApi.js';

export function useTripData(tripId) {
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { get } = useApi();

    useEffect(() => {
        let isMounted = true;
        (async () => {
            setLoading(true);
            try {
                const response = await get(`/trips/${tripId}`);
                if (isMounted) setTrip(response || null);
            } catch {
                if (isMounted) setError('Failed to load trip.');
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [tripId]);

    return { trip, setTrip, loading, setLoading, error, setError };
}
