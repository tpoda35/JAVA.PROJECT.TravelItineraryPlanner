import { useTripData } from './useTripData.js';
import { useTripActivitiesWebSocket } from './useTripActivitiesWebSocket.js';
import { useTripPlannerUI } from './useTripPlannerUI.js';

export default function useTripPlanner(tripId) {
    const { trip, setTrip, loading, setLoading, error, setError } = useTripData(tripId);
    const { sendMessage, isConnected, isConnecting } = useTripActivitiesWebSocket(tripId, trip, setTrip);
    const uiState = useTripPlannerUI();

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
        ...uiState,
    };
}
