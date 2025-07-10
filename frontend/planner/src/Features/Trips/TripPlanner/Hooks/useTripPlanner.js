import {useApi} from "../../../../Hooks/useApi.js";
import {useEffect, useState} from "react";
import {getErrorMessage} from "../../../../Utils/getErrorMessage.js";
import {showErrorToast} from "../../../../Utils/Toastify/showErrorToast.js";
import useWebSocket from "../../../../Hooks/useWebSocket.js";

export default function useTripPlanner(tripId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [trip, setTrip] = useState(null);
    console.log(trip);

    const [expandedDays, setExpandedDays] = useState(new Set());
    const [showAddActivityModal, setShowActivityModal] = useState(false);
    const [activeTripDay, setActiveTripDay] = useState(null);

    // Form
    const initialFormData = {
        title: '',
        description: '',
        startDate: null,
        endDate: null
    };
    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({
        title: '',
        startTime: '',
        endTime: ''
    });

    // Hooks
    const api = useApi();
    const { connect, subscribe, sendMessage, isConnected, isConnecting } = useWebSocket();

    // Connect to WebSocket once when component mounts
    useEffect(() => {
        connect().catch(error => {
            console.error('Failed to connect to WebSocket:', error);
            setError('Failed to connect to real-time updates.');
        });
    }, []);

    // Load trip data
    useEffect(() => {
        let isMounted = true;
        (async () => {
            setLoading(true);
            try {
                const response = await api.get(`/trips/${tripId}`);
                if (isMounted) setTrip(response || null);
            } catch (error) {
                if (isMounted) setError("Failed to load trip.");
            } finally {
                setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, [tripId]);

    // Subscribe to activity updates when activeTripDay changes
    useEffect(() => {
        if (!activeTripDay?.id || !isConnected) return;

        const destination = `/trips/${tripId}/days/${activeTripDay.id}/activities`;

        const unsubscribe = subscribe(destination, (message) => {
            console.log("Received WebSocket message:", message);

            try {
                const response = JSON.parse(message.body);
                const { type, activity, activityId } = response;

                // Update the trip state based on the message type
                setTrip(prevTrip => {
                    if (!prevTrip) return prevTrip;

                    return {
                        ...prevTrip,
                        days: prevTrip.days.map(day => {
                            if (day.id === activeTripDay.id) {
                                const currentActivities = day.activities || [];

                                switch (type) {
                                    case 'ACTIVITY_CREATED':
                                        return {
                                            ...day,
                                            activities: [...currentActivities, activity]
                                        };

                                    case 'ACTIVITY_UPDATED':
                                        return {
                                            ...day,
                                            activities: currentActivities.map(act =>
                                                act.id === activity.id ? activity : act
                                            )
                                        };

                                    case 'ACTIVITY_DELETED':
                                        return {
                                            ...day,
                                            activities: currentActivities.filter(act =>
                                                act.id !== activityId
                                            )
                                        };

                                    default:
                                        // If no type specified, assume it's a create operation
                                        return {
                                            ...day,
                                            activities: [...currentActivities, activity || response]
                                        };
                                }
                            }
                            return day;
                        })
                    };
                });

                // Optional: Show success notification
                if (type === 'ACTIVITY_CREATED' || (!type && activity)) {
                    console.log('Activity added successfully via WebSocket');
                }

            } catch (error) {
                console.error('Error parsing activity message:', error);
            }
        });

        // Cleanup subscription when dependencies change
        // There's a return part implemented in subscribe.
        return unsubscribe;
    }, [activeTripDay?.id, tripId, isConnected]);

    const resetActivityData = () => {
        setFormData(initialFormData);
        setFormErrors({
            title: '',
            startTime: '',
            endTime: ''
        });
    };

    const toggleDay = (dayId) => {
        const newExpanded = new Set(expandedDays);
        if (newExpanded.has(dayId)) {
            newExpanded.delete(dayId);
        } else {
            newExpanded.add(dayId);
        }
        setExpandedDays(newExpanded);
    };

    const onOpenAddActivity = (tripDay) => {
        resetActivityData();
        setActiveTripDay(tripDay);
        setError(null);
        setShowActivityModal(true);
    };

    const handleTimeChange = ([start, end]) => {
        if (!activeTripDay?.date) return;

        const applyFixedDate = (time) => {
            if (!time) return null;
            const fixed = new Date(activeTripDay.date);
            fixed.setHours(time.getHours(), time.getMinutes(), 0, 0);
            return fixed;
        };

        setFormData((prev) => ({
            ...prev,
            startDate: applyFixedDate(start),
            endDate: applyFixedDate(end),
        }));

        if (start && formErrors.startTime) {
            setFormErrors(prev => ({
                ...prev,
                startTime: ''
            }));
        }

        if (end && formErrors.endTime) {
            setFormErrors(prev => ({
                ...prev,
                endTime: ''
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let valid = true;

        const submitErrors = {
            title: '',
            startTime: '',
            endTime: ''
        };

        if (!formData.title.trim()) {
            submitErrors.title = 'Title field cannot be empty.';
            valid = false;
        } else if (formData.title.length > 100) {
            submitErrors.title = 'Title must be 100 characters or less.';
            valid = false;
        }

        if (!formData.startDate) {
            submitErrors.startTime = 'Start time cannot be empty.';
            valid = false;
        }

        if (!formData.endDate) {
            submitErrors.endTime = 'End time cannot be empty.';
            valid = false;
        }

        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            submitErrors.startTime = 'Start time must be before end time.';
            valid = false;
        }

        setFormErrors(submitErrors);

        if (!valid || !activeTripDay) return;

        const payload = {
            type: 'ACTIVITY_CREATED',
            activityDetailsDtoV3: {
                title: formData.title,
                description: formData.description,
                startDate: formData.startDate,
                endDate: formData.endDate
            }
        };

        console.log(payload);

        setLoading(true);
        try {
            // Check if connected before sending
            if (!isConnected) {
                throw new Error('WebSocket not connected');
            }

            sendMessage(
                `/app/trips/${tripId}/days/${activeTripDay.id}/activities`,
                JSON.stringify(payload)
            );

            setShowActivityModal(false);
            resetActivityData();
        } catch (err) {
            const errorMsg = getErrorMessage(err, 'Failed to create activity.');
            setError(errorMsg);
            showErrorToast(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return {
        error,
        loading: loading || isConnecting, // Combine loading states
        trip,
        expandedDays,
        showAddActivityModal,
        formData,
        formErrors,
        isConnected,
        isConnecting,
        setError,
        setShowActivityModal,
        setFormData,
        toggleDay,
        handleTimeChange,
        handleInputChange,
        handleSubmit,
        onOpenAddActivity,
        resetActivityData
    };
}