import {useApi} from "../../../../Hooks/useApi.js";
import {useEffect, useState} from "react";

export default function useTripPlanner(tripId) {
    const [error, setError] = useState(null);

    const [trip, setTrip] = useState(null);

    const api = useApi();

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const response = await api.get(`/trips/${tripId}`);
                if (isMounted) setTrip(response || null);
            } catch (error) {
                if (isMounted) setError("Failed to load folders.");
            }
        })();
        return () => { isMounted = false; };
    }, []);

    return {
        error, trip
    };
}