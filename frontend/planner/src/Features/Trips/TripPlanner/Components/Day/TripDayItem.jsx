import ActivityItem from '../Activity/ActivityItem.jsx';
import {Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import {useActivityModalsProvider} from "../../Contexts/ActivityModalsContext.jsx";
import {memo, useState} from "react";
import TripDayItemContent from "./TripDayItemContent.jsx";
import {useAccommodationModalsProvider} from "../../Contexts/AccommodationModalsContext.jsx";

const TripDayItem = ({ day }) => {
    const { onAddActivity } = useActivityModalsProvider();
    const { onAddAccommodation } = useAccommodationModalsProvider();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleAddSection = (type) => {
        switch(type) {
            case 'activities':
                onAddActivity(day);
                break;
            case 'accommodation':
                onAddAccommodation(day);
                break;
            case 'food':
                onAddFood(day);
                break;
            default:
                break;
        }
        handleCloseMenu();
    };

    return (
        <Box mb={2} p={2} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">{day.day}</Typography>
                    <Typography color="text.secondary" fontSize=".75rem">
                        ({day.date})
                    </Typography>
                </Box>
                <Box display="flex" gap={2}>
                    <IconButton
                        aria-label="Add section"
                        color="success"
                        onClick={handleOpenMenu}
                        title="Add section"
                    >
                        <AddIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                    >
                        <MenuItem onClick={() => handleAddSection('activities')}>
                            <ListItemIcon><DirectionsRunIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Add Activity" />
                        </MenuItem>
                        <MenuItem onClick={() => handleAddSection('accommodation')}>
                            <ListItemIcon><HotelIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Add Accommodation" />
                        </MenuItem>
                        <MenuItem onClick={() => handleAddSection('food')}>
                            <ListItemIcon><RestaurantIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Add Food" />
                        </MenuItem>
                    </Menu>
                </Box>
            </Stack>

            {/* Sections */}
            <Box>
                <TripDayItemContent
                    title="Activities"
                    icon={<DirectionsRunIcon fontSize="small" color="action" />}
                    items={day.tripDayActivities}
                    renderItem={(tripDayActivity) => (
                        <ActivityItem key={tripDayActivity.id} tripDayActivity={tripDayActivity} dayId={day.id} />
                    )}
                    emptyText="No activities planned yet"
                />

                <TripDayItemContent
                    title="Accommodation"
                    icon={<HotelIcon fontSize="small" color="action" />}
                    items={day.tripDayAccommodations}
                    renderItem={(acc) => (
                        <Typography key={acc.id} variant="body2">
                            🏨 {acc.name} — {acc.address}
                        </Typography>
                    )}
                    emptyText="No accommodation added yet"
                />

                <TripDayItemContent
                    title="Food"
                    icon={<RestaurantIcon fontSize="small" color="action" />}
                    items={day.foods}
                    renderItem={(food) => (
                        <Typography key={food.id} variant="body2">
                            🍽 {food.name} — {food.notes}
                        </Typography>
                    )}
                    emptyText="No food stops added yet"
                    withDivider={false}
                />
            </Box>
        </Box>
    );
};

export default memo(TripDayItem);
