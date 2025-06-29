export default function TripItem({
    trip, formatDate, getTripDuration, onRenameTrip, onDeleteTrip
}) {
    return (
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
                    onClick={() => onRenameTrip(trip.id, trip.name)}
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
    )
}