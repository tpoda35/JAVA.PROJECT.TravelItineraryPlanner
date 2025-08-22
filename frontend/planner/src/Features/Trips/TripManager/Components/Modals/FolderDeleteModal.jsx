import {useTripManagerContext} from "../../Contexts/TripManagerContext.js";
import ConfirmModal from "../../../../../Components/Modal/ConfirmModal.jsx";

export default function FolderDeleteModal() {
    const {
        showFolderDeleteModal,
        setShowFolderDeleteModal,
        handleDeleteFolder
    } = useTripManagerContext();

    const handleClose = () => {
        setShowFolderDeleteModal(false);
    };

    return (
        <ConfirmModal
            open={showFolderDeleteModal}
            title="Delete Folder"
            content="Are you sure?"
            onCancel={handleClose}
            onConfirm={handleDeleteFolder}
            confirmText="Delete"
            confirmColor="error"
        />
    );
}
