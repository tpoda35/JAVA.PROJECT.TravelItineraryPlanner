import {useTripManagerContext} from "../../Contexts/TripManagerContext.js";
import {Box, IconButton, Stack, Typography} from "@mui/material";
import {
    CardTravel,
    LocationOn,
    CalendarMonth,
    Add,
    Edit,
    Delete
} from '@mui/icons-material';

export default function TripItem({ trip }) {
    const {
        formatDate,
        getTripDuration,
        onRenameTrip,
        onDeleteTrip,
        navigateToTripPlanner
    } = useTripManagerContext();

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
                <IconButton onClick={() => navigateToTripPlanner(trip.id)} title="Planner">
                    <Add />
                </IconButton>
                <IconButton onClick={() => onRenameTrip(trip.id, trip.name)} title="Edit trip">
                    <Edit />
                </IconButton>
                <IconButton onClick={() => onDeleteTrip(trip.id)} title="Delete trip">
                    <Delete />
                </IconButton>
            </Stack>
        </Box>
    );
}