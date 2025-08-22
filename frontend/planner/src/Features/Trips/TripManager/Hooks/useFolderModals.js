import { useState } from "react";

export function useFolderModals() {
    const [showFolderCreateModal, setShowFolderCreateModal] = useState(false);
    const [showFolderRenameModal, setShowFolderRenameModal] = useState(false);
    const [showFolderDeleteModal, setShowFolderDeleteModal] = useState(false);

    const [folderToDelete, setFolderToDelete] = useState(null);
    const [folderToRename, setFolderToRename] = useState(null);
    const [folderName, setFolderName] = useState("");
    const [newFolderName, setNewFolderName] = useState("");

    const onCreateFolder = () => {
        setFolderName("");
        setShowFolderCreateModal(true);
    };

    const onRenameFolder = (id, name) => {
        setFolderToRename(id);
        setNewFolderName(name);
        setShowFolderRenameModal(true);
    };

    const onDeleteFolder = (id) => {
        setFolderToDelete(id);
        setShowFolderDeleteModal(true);
    };

    return {
        // Modal visibility states
        showFolderCreateModal,
        showFolderRenameModal,
        showFolderDeleteModal,

        // Modal visibility setters
        setShowFolderCreateModal,
        setShowFolderRenameModal,
        setShowFolderDeleteModal,

        // Folder operations state
        folderToDelete,
        folderToRename,
        folderName,
        newFolderName,

        // Folder operations setters
        setFolderToDelete,
        setFolderToRename,
        setFolderName,
        setNewFolderName,

        // Handlers
        onCreateFolder,
        onRenameFolder,
        onDeleteFolder
    };
}