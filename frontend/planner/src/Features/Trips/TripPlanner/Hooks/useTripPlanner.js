import {useApi} from "../../../../Hooks/useApi.js";
import {useEffect, useState} from "react";
import useWebSocket from "../../../../Hooks/useWebSocket.js";

export default function useTripPlanner(tripId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Current trip which the user selected at the trip manager.
    const [trip, setTrip] = useState(null);

    console.log(trip);

    // Hooks
    const { get } = useApi();
    const { connect, subscribe, sendMessage, isConnected, isConnecting } = useWebSocket();

    // Connect to WebSocket once when component mounts
    useEffect(() => {
        connect().catch(error => {
            console.error('Failed to connect to WebSocket:', error);
            setError('Failed to connect to real-time updates.');
        });
    }, [connect]);

    // Load trip data
    useEffect(() => {
        let isMounted = true;
        (async () => {
            setLoading(true);
            try {
                const response = await get(`/trips/${tripId}`);
                if (isMounted) setTrip(response || null);
            } catch (error) {
                if (isMounted) setError("Failed to load trip.");
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, [tripId]);

    // WebSocket subscriptions
    useEffect(() => {
        if (!isConnected || !trip?.tripDays?.length) return;

        const unsubscribeFunctions = [];

        // Subscribe to each trip day
        trip.tripDays.forEach(tripDay => {
            const tripDayId = tripDay.id;
            const destination = `/topic/trips/${tripId}/days/${tripDayId}/activities`;

            const unsubscribe = subscribe(destination, (message) => {
                console.log(`Received WebSocket message for day ${tripDayId}:`, message);

                try {
                    const response = JSON.parse(message.body);
                    const type = response.type;
                    const newActivity = response.activityDetailsDtoV2;
                    const newActivityId = newActivity?.id;

                    setTrip(prevTrip => {
                        if (!prevTrip) return prevTrip;

                        return {
                            ...prevTrip,
                            tripDays: prevTrip.tripDays.map(day => {
                                if (day.id === tripDayId) {
                                    const currentActivities = day.activities || [];

                                    switch (type) {
                                        case 'ACTIVITY_CREATED':
                                            // Check if activity already exists to prevent duplicates
                                            if (currentActivities.some(act => act.id === newActivityId)) {
                                                return day;
                                            }
                                            return {
                                                ...day,
                                                activities: [...currentActivities, newActivity]
                                            };

                                        case 'ACTIVITY_UPDATED_TITLE':
                                        case 'ACTIVITY_UPDATED_DESCRIPTION':
                                        case 'ACTIVITY_UPDATED_START_DATE':
                                        case 'ACTIVITY_UPDATED_END_DATE':
                                            return {
                                                ...day,
                                                activities: currentActivities.map(act =>
                                                    act.id === newActivityId ? newActivity : act
                                                )
                                            };

                                        case 'ACTIVITY_DELETED':
                                            return {
                                                ...day,
                                                activities: currentActivities.filter(act =>
                                                    act.id !== newActivityId
                                                )
                                            };

                                        default:
                                            console.log('Received unknown type from WebSocket:', type);
                                            return day;
                                    }
                                }
                                return day;
                            })
                        };
                    });
                } catch (error) {
                    console.error('Error parsing activity message:', error);
                }
            });

            // Store unsubscribe function if it exists
            if (unsubscribe) {
                unsubscribeFunctions.push(unsubscribe);
            }
        });

        // Cleanup function
        // Use the stored unsubscribe functions
        return () => {
            unsubscribeFunctions.forEach(unsubscribe => {
                if (typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            });
        };
    }, [isConnected, tripId, subscribe]);

    const [showAddActivityModal, setShowAddActivityModal] = useState(false);
    const [activeTripDay, setActiveTripDay] = useState(null);

    const initialFormData = {
        title: '',
        description: '',
        startDate: null,
        endDate: null
    };
    const [formData, setFormData] = useState(initialFormData);
    const initialFormErrors = {
        title: '',
        startTime: '',
        endTime: ''
    };
    const [formErrors, setFormErrors] = useState(initialFormErrors);

    const resetActivityData = () => {
        setFormData(initialFormData);
        setFormErrors(initialFormErrors);
    };

    const onOpenAddActivityModal = (tripDay) => {
        resetActivityData();
        setActiveTripDay(tripDay);
        setShowAddActivityModal(true);
    };

    return {
        error,
        setError,
        loading: loading || isConnecting,
        setLoading,
        trip,

        // Websocket
        isConnected,
        isConnecting,
        sendMessage,

        showAddActivityModal,
        setShowAddActivityModal,
        activeTripDay,
        formData,
        setFormData,
        formErrors,
        setFormErrors,
        onOpenAddActivityModal,
        resetActivityData
    };
}