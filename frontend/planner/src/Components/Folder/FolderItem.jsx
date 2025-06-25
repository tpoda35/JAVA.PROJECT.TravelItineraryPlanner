import './FolderItem.css'
import TripItem from "../../Features/Trips/Components/TripItem.jsx";

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
        <div className="folder-container">
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
                                <TripItem
                                    key={trip.id}
                                    trip={trip}
                                    formatDate={formatDate}
                                    getTripDuration={getTripDuration}
                                    onEditTrip={onEditTrip}
                                    onDeleteTrip={onDeleteTrip}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}