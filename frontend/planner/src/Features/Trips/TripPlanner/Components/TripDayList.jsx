import { TripDayItem } from "./TripDayItem.jsx";
import { Box, Typography } from "@mui/material";
import {useTripPlannerContext} from "../Contexts/TripPlannerContext.js";

export function TripDaysList({ tripDays }) {
    const { trip } = useTripPlannerContext();
    if (!tripDays || tripDays.length === 0) {
        return <Typography>No trip days found</Typography>;
    }

    return (
        <Box mt={2}>
            {tripDays.map((day) => (
                <TripDayItem key={day.id} day={day} tripId={trip.id}/>
            ))}
        </Box>
    );
}
