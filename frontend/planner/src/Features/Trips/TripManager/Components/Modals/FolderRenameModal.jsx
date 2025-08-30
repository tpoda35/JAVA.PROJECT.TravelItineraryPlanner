import {TextField} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import BaseModal from "../../../../../Components/Modal/BaseModal.jsx";
import {useFolderOperationsProvider} from "../../Contexts/FolderOperationsContext.jsx";
import {useFolderModalsProvider} from "../../Contexts/FolderModalsContext.jsx";
import {useFolderDataProvider} from "../../Contexts/FolderDataContext.jsx";

export default function FolderRenameModal() {
    const folderData = useFolderDataProvider();
    const folderModals = useFolderModalsProvider();
    const folderOperations = useFolderOperationsProvider();

    const [formError, setFormError] = useState("");
    const [newFolderName, setNewFolderName] = useState("");

    useEffect(() => {
        if (folderModals.showFolderRenameModal && folderModals.folderToRename) {
            setNewFolderName(folderModals.folderToRename.name);
        }
    }, [folderModals.showFolderRenameModal, folderModals.folderToRename]);

    const handleFolderNameChange = useCallback((e) => {
        setNewFolderName(e.target.value);
        if (formError) {
            setFormError("");
        }
    }, [setNewFolderName, formError]);

    const handleClose = useCallback(() => {
        folderModals.setShowFolderRenameModal(false);
        setFormError("");
        setNewFolderName("");
    }, [folderModals.setShowFolderRenameModal]);

    const actions = [
        {
            label: "Cancel",
            onClick: handleClose
        },
        {
            label: "Save",
            onClick: async () => {
                const ok = await folderOperations.handleRenameFolder(
                    folderModals.folderToRename.id,
                    newFolderName,
                    setFormError,
                    folderModals.setShowFolderRenameModal,
                    folderData.setFolders
                );
                if (ok) handleClose();
            },
            color: "primary",
            variant: "contained"
        }
    ];

    return (
        <BaseModal
            open={folderModals.showFolderRenameModal}
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