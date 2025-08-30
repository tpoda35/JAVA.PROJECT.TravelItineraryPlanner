import { useState, useCallback } from "react";
import ConfirmModal from "../../../../../Components/Modal/ConfirmModal.jsx";
import { useTripModalsProvider } from "../../Contexts/TripModalsContext.jsx";
import { useTripOperationsProvider } from "../../Contexts/TripOperationsContext.jsx";
import { useFolderDataProvider } from "../../Contexts/FolderDataContext.jsx";

export default function TripDeleteModal() {
    const tripModals = useTripModalsProvider();
    const tripOperations = useTripOperationsProvider();
    const folderData = useFolderDataProvider();

    const [formError, setFormError] = useState("");

    const handleClose = useCallback(() => {
        tripModals.setShowTripDeleteModal(false);
        setFormError("");
    }, [tripModals]);

    const handleConfirm = useCallback(async () => {
        if (!tripModals.tripToDelete) return;

        const success = await tripOperations.handleDeleteTrip(
            tripModals.tripToDelete,
            setFormError,
            tripModals.setShowTripDeleteModal,
            folderData.folders,
            folderData.setFolders,
            tripModals.activeFolderId
        );

        if (success) handleClose();
    }, [
        tripOperations,
        tripModals.tripToDelete,
        tripModals.setShowTripDeleteModal,
        folderData.loadFolders,
        handleClose
    ]);

    return (
        <ConfirmModal
            open={tripModals.showTripDeleteModal}
            title="Delete Trip"
            content={formError || "Are you sure?"}
            onCancel={handleClose}
            onConfirm={handleConfirm}
            confirmText="Delete"
            confirmColor="error"
        />
    );
}
