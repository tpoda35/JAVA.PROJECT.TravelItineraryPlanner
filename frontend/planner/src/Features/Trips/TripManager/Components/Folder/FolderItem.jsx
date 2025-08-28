import TripItem from "../Trip/TripItem.jsx";
import {Box, Collapse, IconButton, Stack, Typography} from "@mui/material";
import {Add, ChevronRight, Delete, Edit, ExpandMore, Folder as FolderIcon} from '@mui/icons-material';
import {useNavigation} from "../../Hooks/useNavigation.js";
import {useFolderExpansionProvider} from "../../Contexts/FolderExpansionContext.jsx";
import {useFolderModalsProvider} from "../../Contexts/FolderModalsContext.jsx";
import {memo} from "react";

const folderItem = ({ folder, isExpanded, tripCount, setExpandedFolders }) => {
    const navigate = useNavigation();
    const folderExpansion = useFolderExpansionProvider();
    const folderModals = useFolderModalsProvider();

    console.log('FolderItem render.');

    return (
        <Box p={2} borderRadius={2} bgcolor="background.paper">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                onClick={() => folderExpansion.toggleFolder(folder.id, setExpandedFolders)}
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
                            navigate.navigateToCreateTrip(folder.id);
                        }}
                        title="Create trip"
                    >
                        <Add />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            folderModals.onRenameFolder(folder.id, folder.name);
                        }}
                        title="Rename"
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            folderModals.onDeleteFolder(folder.id);
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
                            <Typography>No trips in this folder yet.</Typography>
                        </Box>
                    ) : (
                        <Stack spacing={2}>
                            {folder.trips.map(trip => (
                                <TripItem key={trip.id} trip={trip} folderId={folder.id} />
                            ))}
                        </Stack>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
}

export default memo(folderItem);