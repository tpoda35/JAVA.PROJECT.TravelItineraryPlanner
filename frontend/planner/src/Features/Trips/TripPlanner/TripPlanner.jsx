import { useParams } from "react-router-dom";
import useTripPlanner from "./Hooks/useTripPlanner.js";
import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen.jsx";
import { TripPlannerContext } from "./Contexts/TripPlannerContext.js";
import TripPlannerModals from "./Components/TripPlannerModals.jsx";
import { TripDaysList } from "./Components/TripDayList.jsx";
import { Box, Typography } from "@mui/material";

export default function TripPlanner() {
    const { tripId } = useParams();
    const planner = useTripPlanner(tripId);

    if (planner.loading || !planner.trip) return <LoadingScreen />;

    return (
        <TripPlannerContext.Provider value={planner}>
            <Box sx={{ px: 3, py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Planner
                </Typography>
                <Typography variant="h5" gutterBottom>
                    {planner.trip.name}
                </Typography>

                <TripDaysList tripDays={planner.trip.tripDays} />
                <TripPlannerModals />
            </Box>
        </TripPlannerContext.Provider>
    );
}
