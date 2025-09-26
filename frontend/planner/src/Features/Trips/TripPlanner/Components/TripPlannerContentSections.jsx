import {Box, Typography} from "@mui/material";
import TripDaysList from "./Day/TripDayList.jsx";
import ActivityCreateModal from "./Modals/ActivityCreateModal.jsx";
import NoteDeleteModal from "./Modals/NoteDeleteModal.jsx";
import TripNoteList from "./Note/TripNoteList.jsx";
import ActivityDeleteModal from "./Modals/ActivityDeleteModal.jsx";
import AccommodationCreateModal from "./Modals/AccommodationCreateModal.jsx";
import FoodCreateModal from "./Modals/FoodCreateModal.jsx";

export default function TripPlannerContentSections({
                                 trip,
                                 containerRef,
                                 sectionRefs,
                                 theme
                             }) {
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
                <TripNoteList />
            </Box>

            <Box ref={sectionRefs.tripDays} sx={{ mb: 4 }}>
                <TripDaysList />
            </Box>

            <Box ref={sectionRefs.budget} marginBottom={35}>
                <Typography variant="h5" gutterBottom>
                    Budget
                </Typography>
                <Typography color="text.secondary">
                    Budget content goes here. Lorem ipsum...
                </Typography>
            </Box>

            <FoodCreateModal />

            <AccommodationCreateModal />

            <ActivityDeleteModal />
            <ActivityCreateModal />

            <NoteDeleteModal />
        </Box>
    );
}
