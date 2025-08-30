import {useCallback, useState} from "react";
import ConfirmModal from "../../../../../Components/Modal/ConfirmModal.jsx";
import {useFolderDataProvider} from "../../Contexts/FolderDataContext.jsx";
import {useFolderModalsProvider} from "../../Contexts/FolderModalsContext.jsx";
import {useFolderOperationsProvider} from "../../Contexts/FolderOperationsContext.jsx";

export default function FolderDeleteModal() {
    const folderData = useFolderDataProvider();
    const folderModals = useFolderModalsProvider();
    const folderOperations = useFolderOperationsProvider();

    const [formError, setFormError] = useState("");

    const handleClose = useCallback(() => {
        folderModals.setShowFolderDeleteModal(false);
        setFormError("");
    }, [folderModals.setShowFolderDeleteModal]);

    const handleConfirm = useCallback(async () => {
        const success = await folderOperations.handleDeleteFolder(
            folderModals.folderToDelete,
            setFormError,
            folderModals.setShowFolderDeleteModal,
            folderData.folders,
            folderData.setFolders
        );
        if (success) handleClose();
    }, [
        folderOperations,
        folderModals.folderToDelete,
        folderModals.setShowFolderDeleteModal,
        folderData.folders,
        folderData.setFolders,
        handleClose
    ]);

    return (
        <ConfirmModal
            open={folderModals.showFolderDeleteModal}
            title="Delete Folder"
            content={formError || "Are you sure?"}
            onCancel={handleClose}
            onConfirm={handleConfirm}
            confirmText="Delete"
            confirmColor="error"
        />
    );
}
