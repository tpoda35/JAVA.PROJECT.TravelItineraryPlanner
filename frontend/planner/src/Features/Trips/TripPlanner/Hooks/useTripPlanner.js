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

    // Helper function to sort activities by start date
    const sortActivities = (activities) => {
        if (!activities || !Array.isArray(activities)) return [];
        return [...activities].sort((a, b) => {
            const aTime = new Date(a.startDate).getTime() || 0;
            const bTime = new Date(b.startDate).getTime() || 0;
            return aTime - bTime;
        });
    };

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
                    console.log(response);
                    const type = response.type;

                    const newActivity = response.activityDetailsDtoV3 || response.activityDetailsDtoV2;
                    const newActivityId = newActivity?.id;

                    if (!newActivity && type !== 'ACTIVITY_DELETED') {
                        console.warn('No activity data found in WebSocket message:', response);
                        return;
                    }

                    setTrip(prevTrip => {
                        if (!prevTrip) return prevTrip;

                        const updatedTrip = {
                            ...prevTrip,
                            tripDays: prevTrip.tripDays.map(day => {
                                if (day.id === tripDayId) {
                                    const currentActivities = day.activities || [];

                                    let updatedActivities;
                                    switch (type) {
                                        case 'ACTIVITY_CREATED':
                                            // Check if activity already exists to prevent duplicates
                                            if (currentActivities.some(act => act.id === newActivityId)) {
                                                console.log('Activity already exists, skipping duplicate');
                                                return day;
                                            }
                                            updatedActivities = [...currentActivities, newActivity];
                                            break;

                                        case 'ACTIVITY_UPDATED_TITLE':
                                        case 'ACTIVITY_UPDATED_DESCRIPTION':
                                        case 'ACTIVITY_UPDATED_START_DATE':
                                        case 'ACTIVITY_UPDATED_END_DATE':
                                            updatedActivities = currentActivities.map(act =>
                                                act.id === newActivityId ? { ...act, ...newActivity } : act
                                            );
                                            break;

                                        case 'ACTIVITY_DELETED':
                                            const activityIdToDelete = newActivityId || response.activityId;
                                            updatedActivities = currentActivities.filter(act =>
                                                act.id !== activityIdToDelete
                                            );
                                            break;

                                        default:
                                            console.log('Received unknown type from WebSocket:', type);
                                            return day;
                                    }

                                    // Sort activities after update
                                    const sortedActivities = sortActivities(updatedActivities);

                                    return {
                                        ...day,
                                        activities: sortedActivities
                                    };
                                }
                                return day;
                            })
                        };

                        console.log('Updated trip state:', updatedTrip);
                        return updatedTrip;
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
        return () => {
            unsubscribeFunctions.forEach(unsubscribe => {
                if (typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            });
        };
    }, [isConnected, tripId, subscribe, trip?.tripDays]);

    const [showActivityAddModal, setShowActivityAddModal] = useState(false);
    const [showActivityDeleteModal, setShowActivityDeleteModal] = useState(false);
    const [activeTripDay, setActiveTripDay] = useState(null);
    const [activityToDelete, setActivityToDelete] = useState(null);

    // ActivityAddModal
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

    const onOpenActivityAddModal = (tripDay) => {
        resetActivityData();
        setActiveTripDay(tripDay);
        setShowActivityAddModal(true);
    };

    return {
        error,
        setError,
        loading: loading || isConnecting,
        setLoading,
        trip,
        tripId,

        // Websocket
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
        setActivityToDelete
    };
}