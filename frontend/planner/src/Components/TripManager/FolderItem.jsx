import './FolderItem.css'

export default function FolderItem ({
                                        folder,
                                        isExpanded,
                                        tripCount,
                                        toggleFolder,
                                        onCreateTrip,
                                        onRenameFolder,
                                        onDeleteFolder,
                                        onEditTrip,
                                        onDeleteTrip,
                                        formatDate,
                                        getTripDuration
}) {
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
                    <span className="trip-count">({tripCount}/10 trips)</span>
                </div>

                <div className="folder-actions">
                    <button
                        className="action-btn"
                        onClick={() => onCreateTrip(folder.id)}
                        title="Add new trip"
                    >
                        ➕
                    </button>
                    <button
                        className="action-btn"
                        onClick={() => onRenameFolder(folder.id, folder.name)}
                        title="Edit folder"
                    >
                        ✏️
                    </button>
                    <button
                        className="action-btn"
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
                                className="btn-success"
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
                                            onClick={() => onEditTrip(trip.id)}
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
    )
}