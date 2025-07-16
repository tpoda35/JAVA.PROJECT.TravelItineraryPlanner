import formatTime from "../../../../Utils/formatTime.js";
import { Box, Typography } from "@mui/material";

export default function ActivityItem({ activity }) {
    return (
        <Box mb={2} p={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
                {formatTime(activity.startDate)} – {formatTime(activity.endDate)}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
                • {activity.title}
            </Typography>
            {activity.description && (
                <Typography variant="body2">{activity.description}</Typography>
            )}
        </Box>
    );
}
