import {TextField} from "@mui/material";
import {useCallback, useState} from "react";
import {useTripManagerContext} from "../../Contexts/TripManagerContext.js";
import BaseModal from "../../../../../Components/Modal/BaseModal.jsx";

export default function FolderCreateModal() {
    const {
        showFolderCreateModal,
        setShowFolderCreateModal,
        folderName,
        setFolderName,
        handleCreateFolder
    } = useTripManagerContext();

    const [formError, setFormError] = useState("");

    const handleFolderNameChange = useCallback((e) => {
        setFolderName(e.target.value);
        if (formError) {
            setFormError(null);
        }
    }, [setFolderName, formError]);

    const handleClose = useCallback(() => {
        setShowFolderCreateModal(false);
        setFormError(null);
    }, [setShowFolderCreateModal]);

    const actions = [
        {
            label: "Cancel",
            onClick: handleClose
        },
        {
            label: "Create",
            onClick: async () => {
                const ok = await handleCreateFolder(setFormError);
                if (ok) handleClose();
            },
            color: "primary",
            variant: "contained"
        }
    ];

    return (
        <BaseModal
            open={showFolderCreateModal}
            onClose={handleClose}
            title="Create Folder"
            actions={actions}
        >
            <TextField
                label="Folder Name"
                value={folderName}
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