import { TextField } from "@mui/material";
import {useCallback, useState} from "react";
import { useTripManagerContext } from "../../Contexts/TripManagerContext.js";
import BaseModal from "../../../../../Components/Modal/BaseModal.jsx";

export default function FolderRenameModal() {
    const {
        showFolderRenameModal,
        setShowFolderRenameModal,
        newFolderName,
        setNewFolderName,
        handleRenameFolder
    } = useTripManagerContext();

    const [formError, setFormError] = useState("");

    const handleFolderNameChange = useCallback((e) => {
        setNewFolderName(e.target.value);
        if (formError) {
            setFormError(null);
        }
    }, [setNewFolderName, formError]);

    const handleClose = useCallback(() => {
        setShowFolderRenameModal(false);
        setFormError(null);
    }, [setShowFolderRenameModal]);

    const actions = [
        {
            label: "Cancel",
            onClick: handleClose
        },
        {
            label: "Save",
            onClick: async () => {
                const ok = await handleRenameFolder(setFormError);
                if (ok) handleClose();
            },
            color: "primary",
            variant: "contained"
        }
    ];

    return (
        <BaseModal
            open={showFolderRenameModal}
            onClose={handleClose}
            title="Rename Folder"
            actions={actions}
        >
            <TextField
                label="New Folder Name"
                value={newFolderName}
                onChange={handleFolderNameChange}
                error={Boolean(formError)}
                helperText={formError || ' '}
                fullWidth
                autoFocus
                margin="dense"
            />
        </BaseModal>
    );
}