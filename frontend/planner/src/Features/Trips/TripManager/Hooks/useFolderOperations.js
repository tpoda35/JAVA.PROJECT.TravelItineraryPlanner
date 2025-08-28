import {useApi} from "../../../../Hooks/useApi.js";
import {getErrorMessage} from "../../../../Utils/getErrorMessage.js";

export function useFolderOperations() {
    const api = useApi();

    const handleCreateFolder = async (folderName, setFormError, setShowFolderCreateModal, setFolders) => {
        if (!folderName.trim()) {
            setFormError("Folder name cannot be empty.");
            return false;
        }
        try {
            const newFolder = await api.post('/folders', { name: folderName.trim() });
            setFolders(prev => [...prev, newFolder]);
            setShowFolderCreateModal(false);
            return true;
        } catch (err) {
            setFormError(getErrorMessage(err, 'Failed to create folder.'));
            return false;
        }
    };

    const handleRenameFolder = async (folderToRename, newFolderName, setFormError, setShowFolderRenameModal, setFolders) => {
        if (!newFolderName.trim()) {
            setFormError("Folder name cannot be empty.");
            return false;
        }
        try {
            await api.patch(`/folders/rename/${folderToRename}?newFolderName=${encodeURIComponent(newFolderName.trim())}`);
            setFolders(prev =>
                prev.map(folder =>
                    folder.id === folderToRename
                        ? { ...folder, name: newFolderName.trim() }
                        : folder
                )
            );
            setShowFolderRenameModal(false);
            return true;
        } catch (err) {
            setFormError(getErrorMessage(err, 'Failed to rename folder.'));
            return false;
        }
    };

    const handleDeleteFolder = async (folderToDelete, setFormError, setShowFolderDeleteModal, folders, setFolders) => {
        try {
            await api.delete(`/folders/${folderToDelete}`);
            setFolders(folders.filter(folder => folder.id !== folderToDelete));
            setShowFolderDeleteModal(false);
            return true;
        } catch (err) {
            setFormError(getErrorMessage(err, 'Failed to delete folder.'));
            return false;
        }
    };

    return { handleCreateFolder, handleRenameFolder, handleDeleteFolder };
}
