import { useState, useEffect } from 'react';
import { useApi } from '../../../../Hooks/useApi.js';

export function useTripData(tripId) {
    const [trip, setTrip] = useState(null);
    const [tripDays, setTripDays] = useState([]);
    const [tripNotes, setTripNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { get } = useApi();

    console.log('Trip: ', trip);
    console.log('TripDays: ', tripDays);
    console.log('TripNotes: ', tripNotes);

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

    useEffect(() => {
        setTripDays(trip?.tripDays || []);
        setTripNotes(trip?.tripNotes || []);
    }, [trip]);

    return {
        trip,
        tripDays, setTripDays,
        tripNotes, setTripNotes,
        setTrip,
        loading,
        setLoading,
        error,
        setError
    };
}
