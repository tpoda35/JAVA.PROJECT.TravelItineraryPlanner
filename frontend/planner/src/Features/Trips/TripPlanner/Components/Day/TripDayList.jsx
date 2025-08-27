import { TripDayItem } from "./TripDayItem.jsx";
import { Box, Typography } from "@mui/material";

export default function TripDaysList({ tripDays }) {
    console.log("TripDaysList render");

    if (!tripDays || tripDays.length === 0) {
        return <Typography>No trip days found</Typography>;
    }

    return (
        <Box mt={2}>
            {tripDays.map((day) => {
                return (
                    <TripDayItem
                        key={day.id}
                        day={day}
                    />
                );
            })}
        </Box>
    );
}