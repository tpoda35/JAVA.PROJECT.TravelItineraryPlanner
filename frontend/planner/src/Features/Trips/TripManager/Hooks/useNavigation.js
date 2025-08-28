import {useNavigate} from "react-router-dom";
import {useCallback} from "react";

export function useNavigation() {
    const navigate = useNavigate();

    const navigateToCreateTrip = useCallback(
        (folderId) => navigate(`/trip-creation/${folderId}`),
        [navigate]
    );

    const navigateToTripPlanner = useCallback(
        (tripId) => navigate(`/trip-planner/${tripId}`),
        [navigate]
    );

    return {
        navigate,
        navigateToCreateTrip,
        navigateToTripPlanner
    };
}
