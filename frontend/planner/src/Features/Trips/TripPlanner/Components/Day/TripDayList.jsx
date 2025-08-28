import {Box, Typography} from "@mui/material";
import TripDayItem from "./TripDayItem.jsx";

export default function TripDaysList({ tripDays }) {
    return (
        <Box mt={2}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                    Trip Days
                </Typography>
            </Box>

            {tripDays?.length === 0 ? (
                <Typography color="text.secondary">No trip days found.</Typography>
            ) : (
                tripDays.map((day) => (
                    <TripDayItem key={day.id} day={day} />
                ))
            )}
        </Box>
    );
}
