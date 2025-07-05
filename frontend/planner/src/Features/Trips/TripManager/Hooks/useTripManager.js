import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useApi} from "../../../../Hooks/useApi.js";
import {getErrorMessage} from "../../../../Utils/getErrorMessage.js"
import {showErrorToast} from "../../../../Utils/Toastify/showErrorToast.js";

export default function useTripManager() {
    const [error, setError] = useState("");
    const errorRef = useRef("");
    const [loading, setLoading] = useState(false);

    const [folders, setFolders] = useState([]);
    const [expandedFolders, setExpandedFolders] = useState(new Set());

    const [showFolderCreateModal, setShowFolderCreateModal] = useState(false);
    const [showFolderRenameModal, setShowFolderRenameModal] = useState(false);
    const [showFolderDeleteModal, setShowFolderDeleteModal] = useState(false);
    const [showTripRenameModal, setShowTripRenameModal] = useState(false);
    const [showTripDeleteModal, setShowTripDeleteModal] = useState(false);

    const [folderToDelete, setFolderToDelete] = useState(null);
    const [folderToRename, setFolderToRename] = useState(null);
    const [folderName, setFolderName] = useState("");
    const [newFolderName, setNewFolderName] = useState("");

    const [tripToRename, setTripToRename] = useState(null);
    const [tripToDelete, setTripToDelete] = useState(null);
    const [newTripName, setNewTripName] = useState("");

    const api = useApi();
    const navigate = useNavigate();

    let errorMsg;

    useEffect(() => {
        let isMounted = true;
        (async () => {
            setLoading(true);
            try {
                const response = await api.get('/folders');
                if (isMounted) setFolders(response || []);
            } catch (err) {
                if (isMounted) {
                    errorMsg = getErrorMessage(err, 'Failed to load folders.');
                    setError(errorMsg);
                    errorRef.current = errorMsg;

                    showErrorToast(errorRef.current);
                }
            } finally {
                setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, []);

    const loadFolders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/folders');
            setFolders(response || []);
        } catch (err) {
            errorMsg = getErrorMessage(err, 'Failed to load folders.');
            setError(errorMsg);
            errorRef.current = errorMsg;

            showErrorToast(errorRef.current);
            setFolders([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getTripDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return `${diffDays} days`;
    };

    const toggleFolder = (folderId) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId);
        } else {
            newExpanded.add(folderId);
        }
        setExpandedFolders(newExpanded);
    };

    const onCreateFolder = () => {
        setFolderName("");
        setError(null);
        setShowFolderCreateModal(true);
    };

    const onRenameFolder = (id, name) => {
        setFolderToRename(id);
        setNewFolderName(name);
        setError(null);
        setShowFolderRenameModal(true);
    };

    const onDeleteFolder = (id) => {
        setFolderToDelete(id);
        setError(null);
        setShowFolderDeleteModal(true);
    };

    const navigateToCreateTrip = (folderId) => navigate(`/trip-creation/${folderId}`);

    const onRenameTrip = (tripId, name) => {
        setTripToRename(tripId);
        setNewTripName(name);
        setError(null);
        setShowTripRenameModal(true);
    };

    const onDeleteTrip = (tripId) => {
        setTripToDelete(tripId);
        setError(null);
        setShowTripDeleteModal(true);
    };

    const navigateToTripPlanner = (tripId) => navigate(`/trip-planner/${tripId}`);

    const handleCreateFolder = async () => {
        if (!folderName.trim()) return setError("Folder name cannot be empty.");
        try {
            await api.post('/folders', { name: folderName.trim() });
            setShowFolderCreateModal(false);
            await loadFolders();
        } catch (err) {
            errorMsg = getErrorMessage(err, 'Failed to create folder.');
            setError(errorMsg);
            errorRef.current = errorMsg;

            showErrorToast(errorRef.current);
        }
    };

    const handleRenameFolder = async () => {
        if (!newFolderName.trim()) return setError("Folder name cannot be empty.");
        try {
            await api.patch(`/folders/rename/${folderToRename}?newFolderName=${encodeURIComponent(newFolderName.trim())}`);
            setShowFolderRenameModal(false);
            await loadFolders();
        } catch (err) {
            errorMsg = getErrorMessage(err, 'Failed to rename folder.');
            setError(errorMsg);
            errorRef.current = errorMsg;

            showErrorToast(errorRef.current);
        }
    };

    const handleDeleteFolder = async () => {
        try {
            await api.delete(`/folders/${folderToDelete}`);
            setFolders(folders.filter(folder => folder.id !== folderToDelete));
        } catch (err) {
            errorMsg = getErrorMessage(err, 'Failed to delete folder.');
            setError(errorMsg);
            errorRef.current = errorMsg;

            showErrorToast(errorRef.current);
        } finally {
            setShowFolderDeleteModal(false);
        }
    };

    const handleRenameTrip = async () => {
        if (!newTripName.trim()) return setError("Trip name cannot be empty.");
        try {
            await api.patch(`/trips/rename/${tripToRename}?newTripName=${encodeURIComponent(newTripName.trim())}`);
            setShowTripRenameModal(false);
            await loadFolders();
        } catch (err) {
            errorMsg = getErrorMessage(err, 'Failed to rename trip.');
            setError(errorMsg);
            errorRef.current = errorMsg;

            showErrorToast(errorRef.current);
        }
    };

    const handleDeleteTrip = async () => {
        try {
            await api.delete(`/trips/${tripToDelete}`);
            await loadFolders();
        } catch (err) {
            errorMsg = getErrorMessage(err, 'Failed to delete trip.');
            setError(errorMsg);
            errorRef.current = errorMsg;

            showErrorToast(errorRef.current);
        } finally {
            setShowTripDeleteModal(false);
        }
    };

    return {
        // State values
        folders,
        loading,
        error,

        // State setters
        setLoading,
        setError,

        // Folder expansion state
        expandedFolders,
        setExpandedFolders,
        toggleFolder,

        // Modal visibility states
        showFolderCreateModal,
        showFolderRenameModal,
        showFolderDeleteModal,
        showTripRenameModal,
        showTripDeleteModal,

        // Modal visibility setters
        setShowFolderCreateModal,
        setShowFolderRenameModal,
        setShowFolderDeleteModal,
        setShowTripRenameModal,
        setShowTripDeleteModal,

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

        // Trip operations state
        tripToRename,
        tripToDelete,
        newTripName,

        // Trip operations setters
        setTripToRename,
        setTripToDelete,
        setNewTripName,

        // Handlers - Folder operations
        onCreateFolder,
        onRenameFolder,
        onDeleteFolder,

        // Handlers - Trip operations
        onRenameTrip,
        onDeleteTrip,

        // Actions (API calls)
        handleCreateFolder,
        handleRenameFolder,
        handleDeleteFolder,
        handleRenameTrip,
        handleDeleteTrip,

        // Navigation
        navigateToCreateTrip,
        navigateToTripPlanner,
        navigate,

        // Utilities
        loadFolders,
        getTripDuration,
        formatDate,

        // External dependencies
        api
    };
}