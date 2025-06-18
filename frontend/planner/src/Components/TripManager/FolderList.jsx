import './FolderList.css'

export default function FolderList
    ({
         folders,
         expandedFolders,
         setExpandedFolders,
         onCreateTrip,
         onEditTrip,
         onDeleteTrip,
         onEditFolder,
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
                    <div key={folder.id} className="folder-container">
                        {/* Folder Header */}
                        <div className="folder-header">
                            <div
                                className="folder-title-section"
                                onClick={() => toggleFolder(folder.id)}
                            >
                <span className={`folder-arrow ${isExpanded ? 'expanded' : ''}`}>
                  ▶
                </span>
                                <span className="folder-icon">📁</span>
                                <span className="folder-name">{folder.name}</span>
                                <span className="trip-count">({tripCount} trips)</span>
                            </div>

                            <div className="folder-actions">
                                <button
                                    className="action-btn create-trip-btn"
                                    onClick={() => onCreateTrip(folder.id)}
                                    title="Add new trip"
                                >
                                    ➕
                                </button>
                                <button
                                    className="action-btn edit-folder-btn"
                                    onClick={() => onEditFolder(folder)}
                                    title="Edit folder"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="action-btn delete-folder-btn"
                                    onClick={() => onDeleteFolder(folder.id)}
                                    title="Delete folder"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>

                        {/* Trips List (shown when expanded) */}
                        {isExpanded && (
                            <div className="trips-container">
                                {tripCount === 0 ? (
                                    <div className="no-trips">
                                        <p>No trips in this folder yet</p>
                                        <button
                                            className="create-first-trip-btn"
                                            onClick={() => onCreateTrip(folder.id)}
                                        >
                                            Create your first trip
                                        </button>
                                    </div>
                                ) : (
                                    <div className="trips-list">
                                        {folder.trips.map(trip => (
                                            <div key={trip.id} className="trip-item">
                                                <div className="trip-main-info">
                                                    <span className="trip-icon">🧳</span>
                                                    <div className="trip-details">
                                                        <h4 className="trip-name">{trip.name}</h4>
                                                        <p className="trip-destination">📍 {trip.destination}</p>
                                                        <p className="trip-dates">
                                                            📅 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                                            <span className="trip-duration">({getTripDuration(trip.startDate, trip.endDate)})</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="trip-actions">
                                                    <button
                                                        className="action-btn edit-trip-btn"
                                                        onClick={() => onEditTrip(trip)}
                                                        title="Edit trip"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="action-btn delete-trip-btn"
                                                        onClick={() => onDeleteTrip(trip.id)}
                                                        title="Delete trip"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}