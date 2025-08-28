import {useTripPlannerContext} from '../../Contexts/TripPlannerContext.js';
import ActivityItem from '../Activity/ActivityItem.jsx';
import {Box, IconButton, Stack, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function TripDayItem({ day }) {
    const {
        onAddActivity
    } = useTripPlannerContext();

    console.log('TripDayList renders.');

    return (
        <Box mb={2} p={2} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">{day.day}</Typography>
                    <Typography color="text.secondary" fontSize=".75rem">
                        ({day.date})
                    </Typography>
                </Box>
                <Box display="flex" gap={2}>
                    <IconButton
                        aria-label="Create activity"
                        color="success"
                        onClick={() => onAddActivity(day)}
                        title="Create activity"
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
            </Stack>

            <Box>
                {day.activities?.length > 0 ? (
                    day.activities.map((activity) => (
                        <ActivityItem
                            key={activity.id}
                            activity={activity}
                            dayId={day.id}
                        />
                    ))
                ) : (
                    <Typography color="text.secondary">No activities planned yet</Typography>
                )}
            </Box>
        </Box>
    );
}
