import FolderList from "../../../../Components/Folder/FolderList.jsx";
import {useEffect, useState} from "react";
import {useApi} from "../../../../Hooks/useApi.js";
import './TripManager.css'
import Modal from "../../../../Components/Modals/Modal.jsx";
import CustomInput from "../../../../Components/Input/CustomInput.jsx";
import LoadingScreen from "../../../../Components/LoadingScreen/LoadingScreen.jsx";
import {useNavigate} from "react-router-dom";

export default function TripManager() {
    const [folders, setFolders] = useState([]);
    const [expandedFolders, setExpandedFolders] = useState(new Set());
    const [error, setError] = useState(null);

    // Folder delete
    const [showFolderDeleteModal, setShowFolderDeleteModal] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState(null);

    // Folder create
    const [showFolderCreateModal, setShowFolderCreateModal] = useState(false);
    const [folderName, setFolderName] = useState("");

    // Folder rename
    const [showFolderRenameModal, setShowFolderRenameModal] = useState(false);
    const [folderToRename, setFolderToRename] = useState(null);
    const [newFolderName, setNewFolderName] = useState("");

    // Trip rename
    const [showTripRenameModal, setShowTripRenameModal] = useState(false);
    const [tripToRename, setTripToRename] = useState(null);
    const [newTripName, setNewTripName] = useState(null);

    // Trip delete
    const [showTripDeleteModal, setShowTripDeleteModal] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);

    const navigate = useNavigate();

    const api = useApi();

    useEffect( () => {
        let isMounted = true; // cleanup flag

        const fetchData = async () => {
            try {
                await loadFolders();
            } catch (error) {
                if (isMounted) {
                    setError("Failed to load folders.");
                    console.error("Failed to load folders:", error);
                }
            }
        };

        fetchData();

        // This return only runs down when a user navigates away or at a re-render
        // when a dependency changes.
        // It doesn't run down at the first mount.
        // This prevents memory leaks and errors/warnings.
        return () => {
            isMounted = false; // cleanup function
        };
    }, []);

    if (api.loading) {
        return (
            <LoadingScreen />
        )
    }

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
            await loadFolders();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create folder');
        }
    };

    const onCreateFolder = () => {
        setFolderName("");
        setError(null);
        setShowFolderCreateModal(true);
    };

    const handleDeleteFolder = async () => {
        if (!folderToDelete) return;

        try {
            await api.delete(`/folders/${folderToDelete}`);
            setFolders(folders.filter(folder => folder.id !== folderToDelete));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete folder');
        } finally {
            setShowFolderDeleteModal(false);
        }
    };


    const onDeleteFolder = (folderId) => {
        setFolderToDelete(folderId);
        setError(null);
        setShowFolderDeleteModal(true);
    };

    const handleRenameFolder = async () => {
        if (!newFolderName.trim()) {
            setError("Folder name cannot be empty");
            return;
        }

        try {
            const trimmedName = encodeURIComponent(newFolderName.trim());
            await api.patch(`/folders/rename/${folderToRename}?newFolderName=${trimmedName}`);
            setNewFolderName("");
            setShowFolderRenameModal(false);
            await loadFolders();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to rename folder');
        }
    };

    const onRenameFolder = (folderId, currentName) => {
        setFolderToRename(folderId);
        setNewFolderName(currentName);
        setError(null);
        setShowFolderRenameModal(true);
    };

    const onCreateTrip = (folderId) => {
        navigate(`/trip-creation/${folderId}`)
    };

    const handleRenameTrip = async () => {
        if (!newTripName.trim()) {
            setError("Trip name cannot be empty");
            return;
        }

        try {
            const trimmedName = encodeURIComponent(newTripName.trim());
            await api.patch(`/trips/rename/${tripToRename}?newTripName=${trimmedName}`);
            setNewTripName("");
            setShowTripRenameModal(false);
            await loadFolders();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to rename trip');
        }
    };

    const onRenameTrip = (tripId, currentName) => {
        setTripToRename(tripId);
        setNewTripName(currentName);
        setError(null);
        setShowTripRenameModal(true);
    }

    const handleDeleteTrip = async () => {
        if (!tripToDelete) return;

        try {
            await api.delete(`/trips/${tripToDelete}`);
            await loadFolders();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete trip');
        } finally {
            setShowTripDeleteModal(false);
        }
    };

    const onDeleteTrip = (tripId) => {
        setTripToDelete(tripId);
        setError(null);
        setShowTripDeleteModal(true);
    }

    return (
        <div className="trip-manager">
            <div>
                <button onClick={onCreateFolder}>
                    Create New Folder
                </button>
            </div>

            <FolderList
                folders={folders}
                expandedFolders={expandedFolders}
                setExpandedFolders={setExpandedFolders}
                onCreateTrip={onCreateTrip}
                onRenameTrip={onRenameTrip}
                onDeleteTrip={onDeleteTrip}
                onRenameFolder={onRenameFolder}
                onDeleteFolder={onDeleteFolder}
            />

            {/* Trip delete modal */}
            <Modal
                isOpen={showTripDeleteModal}
                onClose={() => {
                    setShowTripDeleteModal(false);
                    if (error) setError(null);
                }}
                onConfirm={handleDeleteTrip}
                title="Delete Trip"
                confirmText="Delete"
                confirmButtonClass="btn-danger"
            >
                <p>Are you sure?</p>
            </Modal>

            {/* Trip rename modal */}
            <Modal
                isOpen={showTripRenameModal}
                onClose={() => {
                    setShowTripRenameModal(false);
                    if(error) setError(null);
                }}
                onConfirm={handleRenameTrip}
                title="Rename Trip"
                confirmText="Save"
                confirmButtonClass="btn-success"
            >
                <CustomInput
                    label="New Trip Name"
                    value={newTripName}
                    onChange={(e) => {
                        setNewTripName(e.target.value);
                        if (error) setError(null);
                    }}
                    placeholder="Enter new name"
                    error={error}
                    autoFocus
                />
            </Modal>

            {/* Folder rename modal */}
            <Modal
                isOpen={showFolderRenameModal}
                onClose={() => {
                    setShowFolderRenameModal(false);
                    setError(null);
                }}
                onConfirm={handleRenameFolder}
                title="Rename Folder"
                confirmText="Save"
                confirmButtonClass="btn-success"
            >
                <CustomInput
                    label="New Folder Name"
                    value={newFolderName}
                    onChange={(e) => {
                        setNewFolderName(e.target.value);
                        if (error) setError(null);
                    }}
                    placeholder="Enter new name"
                    error={error}
                    autoFocus
                />
            </Modal>

            {/* Folder create modal */}
            <Modal
                isOpen={showFolderCreateModal}
                onClose={() => {
                    setShowFolderCreateModal(false);
                    if(error) setError(null);
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

            {/* Folder delete modal */}
            <Modal
                isOpen={showFolderDeleteModal}
                onClose={() => {
                    setShowFolderDeleteModal(false);
                    if (error) setError(null);
                }}
                onConfirm={handleDeleteFolder}
                title="Delete Folder"
                confirmText="Delete"
                confirmButtonClass="btn-danger"
            >
                <p>Are you sure? All trips in this folder will be deleted.</p>
            </Modal>
        </div>
    );
}