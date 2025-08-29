import FolderItem from "./FolderItem.jsx";
import {Box, Typography} from "@mui/material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {memo, useState} from "react";

const folderList = ({ folders }) => {
    // These are the folders where the user clicked the extend button.
    const [expandedFolders, setExpandedFolders] = useState(new Set());

    if (!folders || folders.length === 0) {
        return (
            <Box textAlign="center" py={5}>
                <FolderOpenIcon fontSize="large" sx={{ fontSize: 48 }} />
                <Typography variant="h6">No folders yet.</Typography>
                <Typography variant="body2">
                    Create your first folder to organize your trips.
                </Typography>
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {folders.map(folder => (
                <FolderItem
                    key={folder.id}
                    folder={folder}
                    isExpanded={expandedFolders.has(folder.id)}
                    tripCount={folder.trips?.length || 0}
                    setExpandedFolders={setExpandedFolders}
                />
            ))}
        </Box>
    );
}

export default memo(folderList);