import {TextField} from "@mui/material";
import {useCallback, useState} from "react";
import BaseModal from "../../../../../Components/Modal/BaseModal.jsx";
import {useTripModalsProvider} from "../../Contexts/TripModalsContext.jsx";
import {useTripOperationsProvider} from "../../Contexts/TripOperationsContext.jsx";
import {useFolderDataProvider} from "../../Contexts/FolderDataContext.jsx";

export default function TripRenameModal() {
    const tripModals = useTripModalsProvider();
    const tripOperations = useTripOperationsProvider();
    const folderData = useFolderDataProvider();

    const [formError, setFormError] = useState("");

    const handleTripNameChange = useCallback((e) => {
        tripModals.setNewTripName(e.target.value);
        if (formError) {
            setFormError("");
        }
    }, [tripModals.setNewTripName, formError]);

    const handleClose = useCallback(() => {
        tripModals.setShowTripRenameModal(false);
        setFormError("");
    }, [tripModals.setShowTripRenameModal]);

    const actions = [
        {
            label: "Cancel",
            onClick: handleClose
        },
        {
            label: "Save",
            onClick: async () => {
                const ok = await tripOperations.handleRenameTrip(
                    tripModals.tripToRename,
                    tripModals.newTripName,
                    setFormError,
                    tripModals.setShowTripRenameModal,
                    folderData.setFolders,
                    tripModals.activeFolderId
                );
                if (ok) handleClose();
            },
            color: "primary",
            variant: "contained"
        }
    ];

    return (
        <BaseModal
            open={tripModals.showTripRenameModal}
            onClose={handleClose}
            title="Rename Trip"
            actions={actions}
        >
            <TextField
                label="New Trip Name"
                value={tripModals.newTripName}
                onChange={handleTripNameChange}
                error={Boolean(formError)}
                helperText={formError || ' '}
                fullWidth
                autoFocus
                margin="dense"
            />
        </BaseModal>
    );
}