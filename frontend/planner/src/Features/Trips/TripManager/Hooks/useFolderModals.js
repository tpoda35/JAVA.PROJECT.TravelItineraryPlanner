import {useCallback, useState} from "react";

export function useFolderModals() {
    const [showFolderCreateModal, setShowFolderCreateModal] = useState(false);
    const [showFolderRenameModal, setShowFolderRenameModal] = useState(false);
    const [showFolderDeleteModal, setShowFolderDeleteModal] = useState(false);

    const [folderToDelete, setFolderToDelete] = useState(null);
    const [folderToRename, setFolderToRename] = useState(null);

    const onCreateFolder = useCallback(() => {
        setShowFolderCreateModal(true);
    }, []);

    const onRenameFolder = useCallback((id) => {
        setFolderToRename(id);
        setShowFolderRenameModal(true);
    }, []);

    const onDeleteFolder = useCallback((id) => {
        setFolderToDelete(id);
        setShowFolderDeleteModal(true);
    }, []);

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

        // Folder operations setters
        setFolderToDelete,
        setFolderToRename,

        // Handlers
        onCreateFolder,
        onRenameFolder,
        onDeleteFolder
    };
}