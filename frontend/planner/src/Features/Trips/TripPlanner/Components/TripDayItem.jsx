import { useCallback, useMemo } from 'react';
import { useTripPlannerContext } from '../Contexts/TripPlannerContext.js';
import ActivityItem from './ActivityItem.jsx';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export function TripDayItem({ day, tripId }) {
    const { onOpenAddActivityModal, sendMessage } = useTripPlannerContext();

    const sortedActivities = useMemo(() => {
        if (!day.activities) return [];
        return [...day.activities].sort(
            (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );
    }, [day.activities]);

    const handleActivityUpdate = useCallback((updatedActivity, type) => {
        const payload = {
            type,
            activityId: updatedActivity.id,
            activityDetailsDtoV3: updatedActivity,
        };

        sendMessage(
            `/app/trips/${tripId}/days/${day.id}/activities`,
            JSON.stringify(payload)
        );
    }, [tripId, day.id, sendMessage]);

    return (
        <Box mb={2} p={2} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
                <Box display='flex' alignItems='center' gap={1}>
                    <Typography variant='h6'>{day.day}</Typography>
                    <Typography
                        color='text.secondary'
                        fontSize='.75rem'
                    >
                        ({day.date})
                    </Typography>
                </Box>
                <Box display='flex' gap={2}>
                    <IconButton
                        aria-label='Add activity'
                        color='success'
                        onClick={() => onOpenAddActivityModal(day)}
                        title='Add activity'
                    >
                        <AddIcon />
                    </IconButton>
                    {/*
                    <IconButton
                        aria-label='delete'
                        color='error'
                        onClick={() => onOpenDeleteDayModal(day)}
                    >
                        <DeleteIcon />
                    </IconButton>
                    */}
                </Box>
            </Stack>

            <Box>
                {sortedActivities.length > 0 ? (
                    sortedActivities.map((activity) => (
                        <ActivityItem
                            key={activity.id}
                            activity={activity}
                            onUpdate={handleActivityUpdate}
                        />
                    ))
                ) : (
                    <Typography color='text.secondary'>No activities planned yet</Typography>
                )}
            </Box>
        </Box>
    );
}
