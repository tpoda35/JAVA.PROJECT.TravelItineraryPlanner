import { TripDayItem } from "./TripDayItem.jsx";
import { Box, Typography } from "@mui/material";

export default function TripDaysList({ tripDays }) {
    if (!tripDays || tripDays.length === 0) {
        return <Typography>No trip days found</Typography>;
    }

    return (
        <Box mt={2}>
            {tripDays.map((day) => {
                // console.log('Rendering day with activities:', day.activities);

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