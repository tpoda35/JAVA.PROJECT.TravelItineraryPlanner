import FolderList from "./Components/Folder/FolderList.jsx";
import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen.jsx";
import useTripManager from "./Hooks/useTripManager.js";
import TripManagerModals from "./Components/TripManagerModals.jsx";
import {TripManagerContext} from "./Contexts/TripManagerContext.js";
import {Box, Button} from "@mui/material";

export default function TripManager() {
    // This creates a "singleton" from this.
    const manager = useTripManager();

    return (
        // And we are passing it down here, with the same exact data what the top one has.
        <TripManagerContext.Provider value={manager}>
            <Box sx={{ px: 3, py: 4 }}>
                {manager.loading && <LoadingScreen transparent />}
                <Button
                    variant="contained"
                    onClick={manager.onCreateFolder}
                    sx={{ mb: 3 }}
                >
                    Create New Folder
                </Button>

                <FolderList
                    folders={manager.folders}
                    expandedFolders={manager.expandedFolders}
                />

                <TripManagerModals />
            </Box>
        </TripManagerContext.Provider>
    );
}
