import { useTripPlannerContext } from '../../Contexts/TripPlannerContext.js';
import ActivityItem from '../Activity/ActivityItem.jsx';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {useCallback} from "react";
import {initialFormData, initialFormErrors} from "../../Utils/TripPlannerUtils.js";

export function TripDayItem({ day }) {
    const {
        setActiveTripDay,
        setShowActivityAddModal,
        setFormData,
        setFormErrors
    } = useTripPlannerContext();

    // These can be a problems later on, because it's inside a .map
    const resetActivityData = useCallback(() => {
        setFormData(initialFormData);
        setFormErrors(initialFormErrors);
    }, []);

    const onOpenActivityAddModal = useCallback((tripDay) => {
        resetActivityData();
        setActiveTripDay(tripDay);
        setShowActivityAddModal(true);
    }, [resetActivityData]);

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
                        aria-label="Add activity"
                        color="success"
                        onClick={() => onOpenActivityAddModal(day)}
                        title="Add activity"
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
