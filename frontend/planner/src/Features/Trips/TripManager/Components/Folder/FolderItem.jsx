import './FolderItem.css'
import TripItem from "../Trip/TripItem.jsx";
import CustomButton from "../../../../../Components/Buttons/CustomButton.jsx";
import {useTripManagerContext} from "../../Contexts/TripManagerContext.js";

export default function FolderItem ({
                                        folder,
                                        isExpanded,
                                        tripCount
                                    }) {
    const { navigateToCreateTrip, onRenameFolder, onDeleteFolder, toggleFolder } = useTripManagerContext();

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
                    <span className="folder-header-trip-count">({tripCount}/10 trips)</span>
                </div>

                <div className="folder-actions">
                    <CustomButton
                        className="action-btn"
                        text="➕"
                        onClick={() => navigateToCreateTrip(folder.id)}
                        title="Create trip"
                    />
                    <CustomButton
                        className="action-btn"
                        text="✏️️"
                        onClick={() => onRenameFolder(folder.id, folder.name)}
                        title="Edit folder"
                    />
                    <CustomButton
                        className="action-btn"
                        text="🗑️"
                        onClick={() => onDeleteFolder(folder.id)}
                        title="Delete folder"
                    />
                </div>
            </div>

            {/* Trips List (shown when expanded) */}
            {isExpanded && (
                <div className="trips-container">
                    {tripCount === 0 ? (
                        <div className="no-trips">
                            <p>No trips in this folder yet</p>
                            <CustomButton
                                className="btn-success"
                                text="Create your first trip"
                                onClick={() => navigateToCreateTrip(folder.id)}
                            />
                        </div>
                    ) : (
                        <div className="trips-list">
                            {folder.trips.map(trip => (
                                <TripItem
                                    key={trip.id}
                                    trip={trip}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}