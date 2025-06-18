import FolderList from "./FolderList.jsx";
import { useEffect, useState } from "react";
import { useApi } from "../../Hooks/useApi.js";

export default function TripManager() {
    const [folders, setFolders] = useState([]);
    const [expandedFolders, setExpandedFolders] = useState(new Set());
    const [error, setError] = useState(null);
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

    const handleCreateTrip = (folderId) => {
    };

    const handleEditTrip = (trip) => {
    };

    const handleDeleteTrip = (tripId) => {
    };

    const handleEditFolder = (folder) => {
    };

    const handleDeleteFolder = (folderId) => {
    };

    const handleCreateFolder = async () => {
        const name = prompt("Enter folder name:");
        if (name) {
            try {
                await api.post('/folders', {name: name});
                loadFolders();
            } catch (err) {
                setError(err.message || 'Failed to create folder.')
            }
        }
    };

    if (error) {
        return (
            <div className="error-message">
                {error}
                <button onClick={loadFolders} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="trip-manager">
            <div className="header-actions">
                <button onClick={handleCreateFolder} className="create-folder-btn">
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
                onEditFolder={handleEditFolder}
                onDeleteFolder={handleDeleteFolder}
            />
        </div>
    );
}