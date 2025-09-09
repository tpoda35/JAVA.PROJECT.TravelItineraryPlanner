import { useEffect, useMemo } from 'react';
import { useSharedWebSocket } from '../../../../Contexts/WebSocketContext.jsx';
import { sortActivities } from "../Utils/TripPlannerUtils.js";

export function useTripDayWebSocket(tripId, tripDays, setTripDays) {
    const { subscribe, sendMessage, isConnected } = useSharedWebSocket();

    const tripDayIdsKey = useMemo(
        () => (tripDays ? tripDays.map(d => d.id).sort().join(',') : ''),
        [tripDays]
    );

    useEffect(() => {
        if (!isConnected || !tripDays?.length) return;

        const unsubscribeFns = [];

        tripDays.forEach(tripDay => {
            const tripDayId = tripDay.id;
            const destination = `/topic/trips/${tripId}/days/${tripDayId}`;

            const unsub = subscribe(
                destination,
                message => {
                    try {
                        const response = JSON.parse(message.body);
                        const { type, activity, accommodation, food } = response;

                        setTripDays(prevTripDays => {
                            if (!prevTripDays) return prevTripDays;

                            return prevTripDays.map(day => {
                                if (day.id !== tripDayId) return day;

// Activities
                                if (type.startsWith('ACTIVITY') && activity?.id) {
                                    const current = Array.isArray(day.tripDayActivities) ? day.tripDayActivities : [];
                                    let updated = [...current];

                                    switch (type) {
                                        case 'ACTIVITY_CREATED':
                                            if (!current.some(a => a.id === activity.id)) updated.push(activity);
                                            break;
                                        case 'ACTIVITY_UPDATED':
                                        case 'ACTIVITY_UPDATED_TITLE':
                                        case 'ACTIVITY_UPDATED_DESCRIPTION':
                                        case 'ACTIVITY_UPDATED_START_DATE':
                                        case 'ACTIVITY_UPDATED_END_DATE':
                                            updated = current.map(a => a.id === activity.id ? { ...a, ...activity } : a);
                                            break;
                                        case 'ACTIVITY_DELETED':
                                            updated = current.filter(a => a.id !== activity.id);
                                            break;
                                        default:
                                            return day;
                                    }

                                    return { ...day, tripDayActivities: sortActivities(updated) };
                                }

                                // Accommodation
                                if (type.startsWith('ACCOMMODATION') && accommodation?.id) {
                                    const current = Array.isArray(day.accommodation) ? day.accommodation : [];
                                    let updated = [...current];

                                    switch (type) {
                                        case 'ACCOMMODATION_CREATED':
                                            if (!current.some(a => a.id === accommodation.id)) updated.push(accommodation);
                                            break;
                                        case 'ACCOMMODATION_UPDATED':
                                        case 'ACCOMMODATION_UPDATED_NAME':
                                        case 'ACCOMMODATION_UPDATED_ADDRESS':
                                        case 'ACCOMMODATION_UPDATED_CHECK_IN':
                                        case 'ACCOMMODATION_UPDATED_CHECK_OUT':
                                        case 'ACCOMMODATION_UPDATED_NOTES':
                                            updated = current.map(a =>
                                                a.id === accommodation.id ? { ...a, ...accommodation } : a
                                            );
                                            break;
                                        case 'ACCOMMODATION_DELETED':
                                            updated = current.filter(a => a.id !== accommodation.id);
                                            break;
                                        default:
                                            return day;
                                    }

                                    return { ...day, accommodation: updated };
                                }

                                // Food
                                if (type.startsWith('FOOD') && food?.id) {
                                    const current = Array.isArray(day.food) ? day.food : [];
                                    let updated = [...current];

                                    switch (type) {
                                        case 'FOOD_CREATED':
                                            if (!current.some(f => f.id === food.id)) updated.push(food);
                                            break;
                                        case 'FOOD_UPDATED':
                                            updated = current.map(f => f.id === food.id ? { ...f, ...food } : f);
                                            break;
                                        case 'FOOD_DELETED':
                                            updated = current.filter(f => f.id !== food.id);
                                            break;
                                        default:
                                            return day;
                                    }

                                    return { ...day, food: updated };
                                }

                                return day;
                            });
                        });
                    } catch (e) {
                        console.error('Error parsing trip day message:', e);
                    }
                },
                {},
                { replace: true }
            );

            if (typeof unsub === 'function') unsubscribeFns.push(unsub);
        });

        return () => unsubscribeFns.forEach(fn => { try { fn(); } catch {} });
    }, [isConnected, subscribe, tripId, tripDayIdsKey, tripDays?.length, setTripDays]);

    return { sendMessage, isConnected };
}
