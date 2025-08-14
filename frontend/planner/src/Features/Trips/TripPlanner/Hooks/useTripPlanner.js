import { useEffect, useMemo, useCallback, useState } from 'react';
import { useApi } from '../../../../Hooks/useApi.js';
import { useSharedWebSocket } from '../../../../Contexts/WebSocketContext.jsx';

export default function useTripPlanner(tripId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [trip, setTrip] = useState(null);

    const { get } = useApi();
    const { subscribe, sendMessage, isConnected, isConnecting } = useSharedWebSocket();

    // Initial fetch
    useEffect(() => {
        let isMounted = true;
        (async () => {
            setLoading(true);
            try {
                const response = await get(`/trips/${tripId}`);
                if (isMounted) setTrip(response || null);
            } catch (err) {
                if (isMounted) setError('Failed to load trip.');
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [tripId]);

    const sortActivities = useCallback((activities) => {
        if (!Array.isArray(activities)) return [];
        return [...activities].sort((a, b) => {
            const aTime = a?.startDate ? new Date(a.startDate).getTime() : 0;
            const bTime = b?.startDate ? new Date(b.startDate).getTime() : 0;
            return aTime - bTime;
        });
    }, []);

    // Subscribe only when the set of day IDs changes (not when activities change)
    const tripDayIdsKey = useMemo(
        () => (trip?.tripDays ? trip.tripDays.map((d) => d.id).sort().join(',') : ''),
        [trip?.tripDays]
    );

    useEffect(() => {
        if (!isConnected || !trip?.tripDays?.length) return;

        const unsubscribeFns = [];

        trip.tripDays.forEach((tripDay) => {
            const tripDayId = tripDay.id;
            const destination = `/topic/trips/${tripId}/days/${tripDayId}/activities`;

            const unsub = subscribe(
                destination,
                (message) => {
                    try {
                        const response = JSON.parse(message.body);
                        const type = response.type;

                        const newActivity =
                            response.activityDetailsDtoV3 || response.activityDetailsDtoV2 || response.activity;
                        const newActivityId = newActivity?.id;

                        setTrip((prevTrip) => {
                            if (!prevTrip) return prevTrip;

                            const updatedTripDays = prevTrip.tripDays.map((day) => {
                                if (day.id !== tripDayId) return day;

                                const currentActivities = Array.isArray(day.activities) ? day.activities : [];
                                let updatedActivities = currentActivities;

                                switch (type) {
                                    case 'ACTIVITY_CREATED':
                                        if (currentActivities.some((a) => a.id === newActivityId)) {
                                            return day; // already present
                                        }
                                        updatedActivities = [...currentActivities, newActivity];
                                        break;

                                    case 'ACTIVITY_UPDATED_TITLE':
                                    case 'ACTIVITY_UPDATED_DESCRIPTION':
                                    case 'ACTIVITY_UPDATED_START_DATE':
                                    case 'ACTIVITY_UPDATED_END_DATE':
                                    case 'ACTIVITY_UPDATED': // generic
                                        updatedActivities = currentActivities.map((a) =>
                                            a.id === newActivityId ? { ...a, ...newActivity } : a
                                        );
                                        break;

                                    case 'ACTIVITY_DELETED': {
                                        const activityIdToDelete = newActivityId || response.activityId;
                                        updatedActivities = currentActivities.filter((a) => a.id !== activityIdToDelete);
                                        break;
                                    }

                                    default:
                                        // Unknown type, leave day untouched
                                        return day;
                                }

                                return {
                                    ...day,
                                    activities: sortActivities(updatedActivities),
                                };
                            });

                            return { ...prevTrip, tripDays: updatedTripDays };
                        });
                    } catch (e) {
                        console.error('Error parsing activity message:', e);
                    }
                },
                {}, // headers
                { replace: true } // ensure we replace if already subscribed with a previous callback
            );

            if (typeof unsub === 'function') unsubscribeFns.push(unsub);
        });

        return () => {
            unsubscribeFns.forEach((fn) => {
                try {
                    fn();
                } catch {
                    /* noop */
                }
            });
        };
    }, [isConnected, subscribe, tripId, tripDayIdsKey, sortActivities, trip?.tripDays?.length]);

    // UI state
    const [showActivityAddModal, setShowActivityAddModal] = useState(false);
    const [showActivityDeleteModal, setShowActivityDeleteModal] = useState(false);
    const [activeTripDay, setActiveTripDay] = useState(null);
    const [activityToDelete, setActivityToDelete] = useState(null);

    const initialFormData = useMemo(
        () => ({
            title: '',
            description: '',
            startDate: null,
            endDate: null,
        }),
        []
    );
    const [formData, setFormData] = useState(initialFormData);

    const initialFormErrors = useMemo(
        () => ({
            title: '',
            startTime: '',
            endTime: '',
        }),
        []
    );
    const [formErrors, setFormErrors] = useState(initialFormErrors);

    const resetActivityData = useCallback(() => {
        setFormData(initialFormData);
        setFormErrors(initialFormErrors);
    }, [initialFormData, initialFormErrors]);

    const onOpenActivityAddModal = useCallback((tripDay) => {
        resetActivityData();
        setActiveTripDay(tripDay);
        setShowActivityAddModal(true);
    }, [resetActivityData]);

    return {
        error,
        setError,
        loading: loading || isConnecting,
        setLoading,
        trip,
        tripId,

        isConnected,
        isConnecting,
        sendMessage,

        showActivityAddModal,
        setShowActivityAddModal,
        showActivityDeleteModal,
        setShowActivityDeleteModal,

        activeTripDay,
        formData,
        setFormData,
        formErrors,
        setFormErrors,

        onOpenActivityAddModal,
        resetActivityData,

        activityToDelete,
        setActivityToDelete,
    };
}
