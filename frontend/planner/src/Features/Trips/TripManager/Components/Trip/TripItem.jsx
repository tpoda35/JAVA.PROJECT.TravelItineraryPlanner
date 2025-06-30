import CustomButton from "../../../../../Components/Buttons/CustomButton.jsx";
import './TripItem.css'
import {useTripContext} from "../../Contexts/TripContext.js";

export default function TripItem({
                                     trip
                                 }) {
    const { formatDate, getTripDuration, onRenameTrip, onDeleteTrip, navigateToTripPlanner } = useTripContext();

    return (
        <div key={trip.id} className="trip-item">
            <div className="trip-main-info">
                <span className="trip-icon">🧳</span>
                <div>
                    <h4 className="trip-name">{trip.name}</h4>
                    <p className="trip-destination">📍 {trip.destination}</p>
                    <p className="trip-dates">
                        📅 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        <span className="trip-duration">({getTripDuration(trip.startDate, trip.endDate)})</span>
                    </p>
                </div>
            </div>

            <div className="trip-actions">
                <CustomButton
                    className="action-btn"
                    onClick={() => navigateToTripPlanner(trip.id)}
                    title="Planner"
                    text="➕"
                />

                <CustomButton
                    className="action-btn"
                    onClick={() => onRenameTrip(trip.id, trip.name)}
                    title="Edit trip"
                    text="✏️"
                />

                <CustomButton
                    className="action-btn"
                    onClick={() => onDeleteTrip(trip.id)}
                    title="Delete trip"
                    text="🗑️"
                />
            </div>
        </div>
    )
}