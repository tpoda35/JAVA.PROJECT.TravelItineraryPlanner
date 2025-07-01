import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useApi} from "../../../../Hooks/useApi.js";
import {getErrorMessage} from "../../../../Utils/getErrorMessage.js"

export default function useTripManager() {
    const [error, setError] = useState(null);
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

    // const getErrorMessage = (err, msg) => err.response?.data?.message || err.message || msg;

    useEffect(() => {
        let isMounted = true;
        (async () => {
            setLoading(true);
            try {
                const response = await api.get('/folders');
                if (isMounted) setFolders(response || []);
            } catch (err) {
                if (isMounted) setError(getErrorMessage(err, 'Failed to load folders.'));
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
            setError(getErrorMessage(err, 'Failed to load folders.'));
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

    return {
        folders, expandedFolders, setExpandedFolders,
        error, setError, loading, setLoading,
        showFolderCreateModal, setShowFolderCreateModal,
        showFolderRenameModal, setShowFolderRenameModal,
        showFolderDeleteModal, setShowFolderDeleteModal,
        showTripRenameModal, setShowTripRenameModal,
        showTripDeleteModal, setShowTripDeleteModal,
        folderToDelete, setFolderToDelete,
        folderToRename, setFolderToRename,
        folderName, setFolderName,
        newFolderName, setNewFolderName,
        tripToRename, setTripToRename,
        tripToDelete, setTripToDelete,
        newTripName, setNewTripName,
        api, navigate, loadFolders,

        // handlers
        onCreateFolder: () => {
            setFolderName("");
            setError(null);
            setShowFolderCreateModal(true);
        },
        onRenameFolder: (id, name) => {
            setFolderToRename(id);
            setNewFolderName(name);
            setError(null);
            setShowFolderRenameModal(true);
        },
        onDeleteFolder: (id) => {
            setFolderToDelete(id);
            setError(null);
            setShowFolderDeleteModal(true);
        },
        navigateToCreateTrip: (folderId) => navigate(`/trip-creation/${folderId}`),
        onRenameTrip: (tripId, name) => {
            setTripToRename(tripId);
            setNewTripName(name);
            setError(null);
            setShowTripRenameModal(true);
        },
        onDeleteTrip: (tripId) => {
            setTripToDelete(tripId);
            setError(null);
            setShowTripDeleteModal(true);
        },
        navigateToTripPlanner: (tripId) => navigate(`/trip-planner/${tripId}`),

        // Actions (e.g., post/patch/delete)
        async handleCreateFolder() {
            if (!folderName.trim()) return setError("Folder name cannot be empty.");
            try {
                await api.post('/folders', { name: folderName.trim() });
                setShowFolderCreateModal(false);
                await loadFolders();
            } catch (err) {
                setError(getErrorMessage(err, 'Failed to create folder.'));
            }
        },
        async handleRenameFolder() {
            if (!newFolderName.trim()) return setError("Folder name cannot be empty.");
            try {
                await api.patch(`/folders/rename/${folderToRename}?newFolderName=${encodeURIComponent(newFolderName.trim())}`);
                setShowFolderRenameModal(false);
                await loadFolders();
            } catch (err) {
                setError(getErrorMessage(err, 'Failed to rename folder.'));
            }
        },
        async handleDeleteFolder() {
            try {
                await api.delete(`/folders/${folderToDelete}`);
                setFolders(folders.filter(folder => folder.id !== folderToDelete));
            } catch (err) {
                setError(getErrorMessage(err, 'Failed to delete folder.'));
            } finally {
                setShowFolderDeleteModal(false);
            }
        },
        async handleRenameTrip() {
            if (!newTripName.trim()) return setError("Trip name cannot be empty.");
            try {
                await api.patch(`/trips/rename/${tripToRename}?newTripName=${encodeURIComponent(newTripName.trim())}`);
                setShowTripRenameModal(false);
                await loadFolders();
            } catch (err) {
                setError(getErrorMessage(err, 'Failed to rename trip.'));
            }
        },
        async handleDeleteTrip() {
            try {
                await api.delete(`/trips/${tripToDelete}`);
                await loadFolders();
            } catch (err) {
                setError(getErrorMessage(err, 'Failed to delete trip.'));
            } finally {
                setShowTripDeleteModal(false);
            }
        },
        // Utility functions
        getTripDuration, formatDate, toggleFolder
    };
}
