import {Box, IconButton, Stack, Typography} from "@mui/material";
import {Add, CalendarMonth, CardTravel, Delete, Edit, LocationOn} from '@mui/icons-material';
import {useTripModalsProvider} from "../../Contexts/TripModalsContext.jsx";
import {useNavigation} from "../../Hooks/useNavigation.js";
import {formatDate, getTripDuration} from "../../utils/TripManagerUtils.js";

export default function TripItem({ trip, folderId }) {
    const tripModals = useTripModalsProvider();
    const navigate = useNavigation();

    return (
        <Box
            p={2}
            border="1px solid"
            borderColor="divider"
            borderRadius={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="background.default"
        >
            <Stack direction="row" spacing={2} alignItems="center">
                <CardTravel fontSize="large" />
                <Box>
                    <Typography variant="h6">{trip.name}</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOn fontSize="small" />
                        <Typography variant="body2">{trip.destination}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarMonth fontSize="small" />
                        <Typography variant="body2">
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}{' '}
                            <Typography variant="caption" component="span">
                                ({getTripDuration(trip.startDate, trip.endDate)})
                            </Typography>
                        </Typography>
                    </Stack>
                </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
                <IconButton onClick={() => navigate.navigateToTripPlanner(trip.id)} title="Planner">
                    <Add />
                </IconButton>
                <IconButton onClick={() => tripModals.onRenameTrip(trip.id, trip.name, folderId)} title="Edit trip">
                    <Edit />
                </IconButton>
                <IconButton onClick={() => tripModals.onDeleteTrip(trip.id)} title="Delete trip">
                    <Delete />
                </IconButton>
            </Stack>
        </Box>
    );
}