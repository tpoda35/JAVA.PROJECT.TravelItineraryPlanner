import TripItem from "../Trip/TripItem.jsx";
import {useTripManagerContext} from "../../Contexts/TripManagerContext.js";
import {Box, Collapse, IconButton, Stack, Typography} from "@mui/material";
import {Add, ChevronRight, Delete, Edit, ExpandMore, Folder as FolderIcon} from '@mui/icons-material';

export default function FolderItem({ folder, isExpanded, tripCount }) {
    const {
        navigateToCreateTrip,
        onRenameFolder,
        onDeleteFolder,
        toggleFolder
    } = useTripManagerContext();

    return (
        <Box p={2} borderRadius={2} bgcolor="background.paper">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                onClick={() => toggleFolder(folder.id)}
                sx={{ cursor: 'pointer' }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    {isExpanded ? <ExpandMore /> : <ChevronRight />}
                    <FolderIcon />
                    <Typography variant="h6">{folder.name}</Typography>
                    <Typography color="text.secondary">({tripCount}/10 trips)</Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigateToCreateTrip(folder.id);
                        }}
                        title="Create trip"
                    >
                        <Add />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRenameFolder(folder.id, folder.name);
                        }}
                        title="Rename"
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteFolder(folder.id);
                        }}
                        title="Delete"
                    >
                        <Delete />
                    </IconButton>
                </Stack>
            </Box>

            <Collapse in={isExpanded}>
                <Box mt={2} pl={4}>
                    {tripCount === 0 ? (
                        <Box textAlign="center">
                            <Typography>No trips in this folder yet</Typography>
                            <Box mt={1}>
                                <Add
                                    onClick={() => navigateToCreateTrip(folder.id)}
                                    sx={{ cursor: 'pointer' }}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Stack spacing={2}>
                            {folder.trips.map(trip => (
                                <TripItem key={trip.id} trip={trip} />
                            ))}
                        </Stack>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
}