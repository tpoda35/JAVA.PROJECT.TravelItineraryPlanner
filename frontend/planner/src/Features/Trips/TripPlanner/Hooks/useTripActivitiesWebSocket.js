import { useEffect, useMemo } from 'react';
import { useSharedWebSocket } from '../../../../Contexts/WebSocketContext.jsx';
import { sortActivities } from "../Utils/TripPlannerUtils.js";

export function useTripActivitiesWebSocket(tripId, tripDays, setTripDays) {
    const { subscribe, sendMessage, isConnected } = useSharedWebSocket();

    const tripDayIdsKey = useMemo(
        () => (tripDays ? tripDays.map((d) => d.id).sort().join(',') : ''),
        [tripDays]
    );

    useEffect(() => {
        if (!isConnected || !tripDays?.length) return;

        const unsubscribeFns = [];

        tripDays.forEach((tripDay) => {
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

                        setTripDays((prevTripDays) => {
                            if (!prevTripDays) return prevTripDays;

                            return prevTripDays.map((day) => {
                                if (day.id !== tripDayId) return day;

                                const currentActivities = Array.isArray(day.activities) ? day.activities : [];
                                let updatedActivities = currentActivities;

                                switch (type) {
                                    case 'ACTIVITY_CREATED':
                                        if (currentActivities.some((a) => a.id === newActivityId)) return day;
                                        updatedActivities = [...currentActivities, newActivity];
                                        break;

                                    case 'ACTIVITY_UPDATED_TITLE':
                                    case 'ACTIVITY_UPDATED_DESCRIPTION':
                                    case 'ACTIVITY_UPDATED_START_DATE':
                                    case 'ACTIVITY_UPDATED_END_DATE':
                                    case 'ACTIVITY_UPDATED':
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
                                        return day;
                                }

                                return { ...day, activities: sortActivities(updatedActivities) };
                            });
                        });
                    } catch (e) {
                        console.error('Error parsing activity message:', e);
                    }
                },
                {},
                { replace: true }
            );

            if (typeof unsub === 'function') unsubscribeFns.push(unsub);
        });

        return () => unsubscribeFns.forEach((fn) => { try { fn(); } catch {} });
    }, [isConnected, subscribe, tripId, tripDayIdsKey, tripDays?.length, setTripDays]);

    return { sendMessage, isConnected };
}
