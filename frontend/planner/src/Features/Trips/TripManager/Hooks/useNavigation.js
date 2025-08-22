import { useNavigate } from "react-router-dom";

export function useNavigation() {
    const navigate = useNavigate();

    const navigateToCreateTrip = (folderId) => navigate(`/trip-creation/${folderId}`);
    const navigateToTripPlanner = (tripId) => navigate(`/trip-planner/${tripId}`);

    return {
        navigate,
        navigateToCreateTrip,
        navigateToTripPlanner
    };
}
