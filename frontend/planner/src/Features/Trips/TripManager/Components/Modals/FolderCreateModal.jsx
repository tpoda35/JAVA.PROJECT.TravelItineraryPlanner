import {TextField} from "@mui/material";
import {useCallback, useState} from "react";
import BaseModal from "../../../../../Components/Modal/BaseModal.jsx";
import {useFolderModalsProvider} from "../../Contexts/FolderModalsContext.jsx";
import {useFolderOperationsProvider} from "../../Contexts/FolderOperationsContext.jsx";
import {useFolderDataProvider} from "../../Contexts/FolderDataContext.jsx";

export default function FolderCreateModal() {
    const folderData = useFolderDataProvider();
    const folderModals = useFolderModalsProvider();
    const folderOperations = useFolderOperationsProvider();

    const [formError, setFormError] = useState("");
    const [folderName, setFolderName] = useState("");

    const handleFolderNameChange = useCallback((e) => {
        setFolderName(e.target.value);
        if (formError) {
            setFormError("");
        }
    }, [setFolderName, formError]);

    const handleClose = useCallback(() => {
        folderModals.setShowFolderCreateModal(false);
        setFormError("");
        setFolderName("");
    }, [folderModals.setShowFolderCreateModal]);

    const actions = [
        {
            label: "Cancel",
            onClick: handleClose
        },
        {
            label: "Create",
            onClick: async () => {
                const ok = await folderOperations.handleCreateFolder(
                    folderName,
                    setFormError,
                    folderModals.setShowFolderCreateModal,
                    folderData.setFolders
                );
                if (ok) handleClose();
            },
            color: "primary",
            variant: "contained",
            disabled: !folderName.trim()
        }
    ];

    return (
        <BaseModal
            open={folderModals.showFolderCreateModal}
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