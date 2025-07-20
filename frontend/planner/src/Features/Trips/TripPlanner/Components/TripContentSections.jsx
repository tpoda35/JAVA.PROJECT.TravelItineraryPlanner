import {Box, Typography} from "@mui/material";
import {TripDaysList} from "./TripDayList.jsx";
import TripPlannerModals from "./TripPlannerModals.jsx";

export default function TripContentSections({ trip, containerRef, sectionRefs, theme, tripId }) {
    return (
        <Box
            ref={containerRef}
            component="main"
            sx={{
                flex: 1,
                height: "calc(100vh - 64px)",
                boxSizing: "border-box",
                overflowY: "auto",
                px: 4,
                py: 4,
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
                scrollBehavior: "smooth",
            }}
        >
            <Typography variant="h4" gutterBottom marginBottom={6}>
                {trip.name}
            </Typography>

            <Box ref={sectionRefs.notes} sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>Notes</Typography>
                <Typography color="text.secondary">
                    Notes content goes here. Lorem ipsum...
                </Typography>
            </Box>

            <Box ref={sectionRefs.tripDays} sx={{ maxWidth: 800, mb: 4 }}>
                <Typography variant="h5" gutterBottom>Trip Days</Typography>
                <TripDaysList tripDays={trip.tripDays} />
            </Box>

            <Box ref={sectionRefs.budget} marginBottom={35}>
                <Typography variant="h5" gutterBottom>Budget</Typography>
                <Typography color="text.secondary">
                    Budget content goes here. Lorem ipsum...
                </Typography>
            </Box>

            <TripPlannerModals tripId={tripId} />
        </Box>
    );
}
