import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen.jsx";
import {Box, Button} from "@mui/material";
import FolderList from "./Components/Folder/FolderList.jsx";
import FolderCreateModal from "./Components/Modals/FolderCreateModal.jsx";
import FolderDeleteModal from "./Components/Modals/FolderDeleteModal.jsx";
import FolderRenameModal from "./Components/Modals/FolderRenameModal.jsx";
import TripDeleteModal from "./Components/Modals/TripDeleteModal.jsx";
import TripRenameModal from "./Components/Modals/TripRenameModal.jsx";
import {useFolderExpansionProvider} from "./Contexts/FolderExpansionContext.jsx";
import {useFolderDataProvider} from "./Contexts/FolderDataContext.jsx";
import {useFolderModalsProvider} from "./Contexts/FolderModalsContext.jsx";

export default function TripManagerContent() {
    const folderData = useFolderDataProvider();
    const folderExpansion = useFolderExpansionProvider();
    const folderModals = useFolderModalsProvider();

    return (
        <>
            {folderData.loading && <LoadingScreen transparent />}

            <Box sx={{ px: 3, py: 4 }}>
                <Button
                    variant="contained"
                    onClick={folderModals.onCreateFolder}
                    sx={{ mb: 3 }}
                >
                    Create New Folder
                </Button>

                <FolderList
                    folders={folderData.folders}
                    expandedFolders={folderExpansion.expandedFolders}
                />

                <FolderCreateModal />
                <FolderDeleteModal />
                <FolderRenameModal />
                <TripDeleteModal />
                <TripRenameModal />
            </Box>
        </>
    )
}