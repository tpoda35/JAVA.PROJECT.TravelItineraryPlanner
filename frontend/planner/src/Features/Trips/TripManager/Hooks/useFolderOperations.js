import { useApi } from "../../../../Hooks/useApi.js";
import { getErrorMessage } from "../../../../Utils/getErrorMessage.js";
import { showErrorToast } from "../../../../Utils/Toastify/showErrorToast.js";

export function useFolderOperations() {
    const api = useApi();

    const handleCreateFolder = async (folderName, setFormError, setError, setShowFolderCreateModal, setFolders) => {
        if (!folderName.trim()) return setFormError("Folder name cannot be empty.");
        try {
            const newFolder = await api.post('/folders', { name: folderName.trim() });
            setFolders((prevFolders) => [...prevFolders, newFolder]);

            setShowFolderCreateModal(false);
        } catch (err) {
            const errorMsg = getErrorMessage(err, 'Failed to create folder.');
            setError(errorMsg);
            showErrorToast(errorMsg);
        }
    };

    const handleRenameFolder = async (folderToRename, newFolderName, setFormError, setError, setShowFolderRenameModal, setFolders) => {
        if (!newFolderName.trim()) return setFormError("Folder name cannot be empty.");
        try {
            await api.patch(`/folders/rename/${folderToRename}?newFolderName=${encodeURIComponent(newFolderName.trim())}`);

            setFolders((prevFolders) =>
                prevFolders.map((folder) =>
                    folder.id === folderToRename
                        ? { ...folder, name: newFolderName.trim() }
                        : folder
                )
            );

            setShowFolderRenameModal(false);
        } catch (err) {
            const errorMsg = getErrorMessage(err, 'Failed to rename folder.');
            setError(errorMsg);
            showErrorToast(errorMsg);
        }
    };

    const handleDeleteFolder = async (folderToDelete, setError, setShowFolderDeleteModal, folders, setFolders) => {
        try {
            await api.delete(`/folders/${folderToDelete}`);
            setShowFolderDeleteModal(false);
            setFolders(folders.filter(folder => folder.id !== folderToDelete));
        } catch (err) {
            const errorMsg = getErrorMessage(err, 'Failed to delete folder.');
            setError(errorMsg);
            showErrorToast(errorMsg);
        }
    };

    return {
        handleCreateFolder,
        handleRenameFolder,
        handleDeleteFolder
    };
}