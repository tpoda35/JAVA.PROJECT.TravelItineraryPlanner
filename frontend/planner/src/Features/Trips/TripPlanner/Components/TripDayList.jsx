import { TripDayItem } from "./TripDayItem.jsx";
import { Box, Typography } from "@mui/material";

export function TripDaysList({ tripDays }) {
    if (!tripDays || tripDays.length === 0) {
        return <Typography>No trip days found</Typography>;
    }

    return (
        <Box mt={3}>
            <Typography variant="h6" gutterBottom>
                Add activities to each day:
            </Typography>
            {tripDays.map((day) => (
                <TripDayItem key={day.id} day={day} />
            ))}
        </Box>
    );
}
