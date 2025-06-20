import './FolderList.css'
import FolderItem from "./FolderItem.jsx";

export default function FolderList
    ({
         folders,
         expandedFolders,
         setExpandedFolders,
         onCreateTrip,
         onEditTrip,
         onDeleteTrip,
         onRenameFolder,
         onDeleteFolder
})
{

    const toggleFolder = (folderId) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId);
        } else {
            newExpanded.add(folderId);
        }
        setExpandedFolders(newExpanded);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Calculate trip duration
    const getTripDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return `${diffDays} days`;
    };

    if (!folders || folders.length === 0) {
        return (
            <div className="folder-list-empty">
                <div className="empty-icon">📁</div>
                <h3>No folders yet</h3>
                <p>Create your first folder to organize your trips</p>
            </div>
        );
    }

    return (
        <div className="folder-list">
            {folders.map(folder => {
                const isExpanded = expandedFolders.has(folder.id);
                const tripCount = folder.trips ? folder.trips.length : 0;

                return (
                    <FolderItem
                        key={folder.id}
                        folder={folder}
                        isExpanded={isExpanded}
                        tripCount={tripCount}
                        toggleFolder={toggleFolder}
                        onCreateTrip={onCreateTrip}
                        onRenameFolder={onRenameFolder}
                        onDeleteFolder={onDeleteFolder}
                        onEditTrip={onEditTrip}
                        onDeleteTrip={onDeleteTrip}
                        formatDate={formatDate}
                        getTripDuration={getTripDuration}
                    />
                );
            })}
        </div>
    );
}