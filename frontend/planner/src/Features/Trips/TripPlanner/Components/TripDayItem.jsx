import { useMemo } from "react";
import { useTripPlannerContext } from "../Contexts/TripPlannerContext.js";
import ActivityItem from "./ActivityItem.jsx";
import { Box, Typography, Button, Stack } from "@mui/material";

export function TripDayItem({ day }) {
    const { onOpenAddActivity } = useTripPlannerContext();

    const sortedActivities = useMemo(() => {
        if (!day.activities) return [];
        return [...day.activities].sort(
            (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );
    }, [day.activities]);

    return (
        <Box mb={4} p={2} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">{day.day}</Typography>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => onOpenAddActivity(day)}
                >
                    Add Activity
                </Button>
            </Stack>

            <Box>
                {sortedActivities.length > 0 ? (
                    sortedActivities.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                    ))
                ) : (
                    <Typography color="text.secondary">No activities planned yet</Typography>
                )}
            </Box>
        </Box>
    );
}
