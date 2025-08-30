import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen.jsx";
import {Box, Button} from "@mui/material";
import FolderList from "./Components/Folder/FolderList.jsx";
import FolderCreateModal from "./Components/Modals/FolderCreateModal.jsx";
import FolderDeleteModal from "./Components/Modals/FolderDeleteModal.jsx";
import FolderRenameModal from "./Components/Modals/FolderRenameModal.jsx";
import TripDeleteModal from "./Components/Modals/TripDeleteModal.jsx";
import TripRenameModal from "./Components/Modals/TripRenameModal.jsx";
import {useFolderDataProvider} from "./Contexts/FolderDataContext.jsx";
import {useFolderModalsProvider} from "./Contexts/FolderModalsContext.jsx";

export default function TripManagerContent() {
    const folderData = useFolderDataProvider();
    const folderModals = useFolderModalsProvider();

    // TripManager renders once, TripManagerContent renders once, FolderList renders once.
    // folderData.loading and folderData.folders changing because of the async api call,
    // causes +2 TripManagerContent re-render.
    // Because folders state loads, FolderList re-renders because of the change of folderData.folders,
    // this will also render FolderItem according to how many objects in the folders state.
    // = 5 renders minimum.
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