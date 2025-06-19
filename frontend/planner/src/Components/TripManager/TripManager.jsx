import FolderList from "./FolderList.jsx";
import {useEffect, useState} from "react";
import {useApi} from "../../Hooks/useApi.js";
import './TripManager.css'
import Modal from "../Modals/Modal.jsx";
import CustomInput from "../Input/CustomInput.jsx";

export default function TripManager() {
    const [folders, setFolders] = useState([]);
    const [expandedFolders, setExpandedFolders] = useState(new Set());
    const [error, setError] = useState(null);

    const [showFolderDeleteModal, setShowFolderDeleteModal] = useState(false);
    const [showFolderCreateModal, setShowFolderCreateModal] = useState(false);
    const [showFolderRenameModal, setShowFolderRenameModal] = useState(false);

    const [folderToDelete, setFolderToDelete] = useState(null);
    const [folderToRename, setFolderToRename] = useState(null);
    const [folderName, setFolderName] = useState("");
    const [newFolderName, setNewFolderName] = useState("");

    const api = useApi();

    useEffect(() => {
        loadFolders();
    }, []);

    const loadFolders = async () => {
        setError(null);
        try {
            const response = await api.get('/folders');
            setFolders(response || []);
        } catch (err) {
            if (err.message.includes('404')) {
                setFolders([]);
            } else {
                setError(err.response?.data?.message || 'Failed to load folders');
                setFolders([]);
            }
        }
    };

    const handleCreateFolder = async () => {
        if (!folderName.trim()) {
            setError("Folder name cannot be empty");
            return;
        }

        try {
            await api.post('/folders', { name: folderName.trim() });
            setFolderName("");
            setShowFolderCreateModal(false);
            loadFolders();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create folder');
        }
    };

    const openCreateFolderModal = () => {
        setFolderName("");
        setError(null);
        setShowFolderCreateModal(true);
    };

    const handleDeleteFolder = async (folderId) => {
        try {
            await api.delete(`/folders/${folderId}`);
            setFolders(folders.filter(folder => folder.id !== folderId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete folder');
        } finally {
            setShowFolderDeleteModal(false);
        }
    };

    const confirmDeleteFolder = (folderId) => {
        setFolderToDelete(folderId);
        setShowFolderDeleteModal(true);
    };

    // const handleRenameFolder = async () => {
    //     if (!newFolderName.trim()) {
    //         setError("Folder name cannot be empty");
    //         return;
    //     }
    //
    //     try {
    //         await api.patch(`/folders/rename/${folderToRename}`, null, {
    //             params: { newFolderName: newFolderName.trim() }
    //         });
    //         setNewFolderName("");
    //         setShowFolderRenameModal(false);
    //         await loadFolders();
    //     } catch (err) {
    //         setError(err.response?.data?.message || 'Failed to rename folder');
    //     }
    // };

    const openRenameFolderModal = (folderId, currentName) => {
        // setFolderToRename(folderId);
        // setNewFolderName(currentName);
        // setError(null);
        // setShowFolderRenameModal(true);
    };

    const handleCreateTrip = (folderId) => {
    };

    const handleEditTrip = (trip) => {
    };

    const handleDeleteTrip = (tripId) => {
    };

    return (
        <div className="trip-manager">
            <div>
                <button onClick={openCreateFolderModal}>
                    Create New Folder
                </button>
            </div>

            <FolderList
                folders={folders}
                expandedFolders={expandedFolders}
                setExpandedFolders={setExpandedFolders}
                onCreateTrip={handleCreateTrip}
                onEditTrip={handleEditTrip}
                onDeleteTrip={handleDeleteTrip}
                onEditFolder={openRenameFolderModal}
                onDeleteFolder={confirmDeleteFolder}
            />

            {/*<Modal*/}
            {/*    isOpen={showFolderRenameModal}*/}
            {/*    onClose={() => {*/}
            {/*        setShowFolderRenameModal(false);*/}
            {/*        setError(null);*/}
            {/*    }}*/}
            {/*    onConfirm={handleRenameFolder}*/}
            {/*    title="Rename Folder"*/}
            {/*    confirmText="Save"*/}
            {/*    confirmButtonClass="btn-success"*/}
            {/*>*/}
            {/*    <CustomInput*/}
            {/*        label="New Folder Name"*/}
            {/*        value={newFolderName}*/}
            {/*        onChange={(e) => {*/}
            {/*            setNewFolderName(e.target.value);*/}
            {/*            if (error) setError(null);*/}
            {/*        }}*/}
            {/*        placeholder="Enter new name"*/}
            {/*        error={error}*/}
            {/*        autoFocus*/}
            {/*    />*/}
            {/*</Modal>*/}

            <Modal
                isOpen={showFolderCreateModal}
                onClose={() => {
                    setShowFolderCreateModal(false);
                    setError(null);
                }}
                onConfirm={handleCreateFolder}
                title="Create Folder"
                confirmText="Create"
                confirmButtonClass="btn-success"
            >
                <CustomInput
                    label="Folder Name"
                    value={folderName}
                    onChange={(e) => {
                        setFolderName(e.target.value);
                        if (error) setError(null);
                    }}
                    placeholder="Enter folder name"
                    error={error}
                    autoFocus
                />
            </Modal>

            <Modal
                isOpen={showFolderDeleteModal}
                onClose={() => setShowFolderDeleteModal(false)}
                onConfirm={() => handleDeleteFolder(folderToDelete)}
                title="Delete Folder"
                confirmText="Delete"
                confirmButtonClass="btn-danger"
            >
                <p>Are you sure? All trips in this folder will be deleted.</p>
            </Modal>
        </div>
    );
}