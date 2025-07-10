import './TripDayItem.css'
import {useTripPlannerContext} from "../Contexts/TripPlannerContext.js";
import CustomButton from "../../../../Components/Buttons/CustomButton.jsx";

export function TripDayItem({ day, isExpanded }) {
    const {toggleDay, onOpenAddActivity} = useTripPlannerContext();

    return (
        <div className="trip-day-item">
            {/* Day Header */}
            <div className="trip-day-header" onClick={() => toggleDay(day.id)}>
                <div className="trip-day-title-section">
                    <span className={`trip-day-arrow ${isExpanded ? 'expanded' : ''}`}>
                        ▶
                    </span>
                    <span className="trip-day-name">{day.day}</span>
                </div>
            </div>

            {/* Day Content (shown when expanded) */}
            {isExpanded && (
                <div className="trip-day-content">
                    {day.activities && day.activities.length > 0 ? (
                        day.activities.map(activity => (
                            <div key={activity.id} className="trip-day-activity">
                                • {activity.title}
                            </div>
                        ))
                    ) : (
                        <div className="no-activities">
                            <p>No activities planned yet</p>
                            <CustomButton
                                className="btn-success"
                                onClick={() => onOpenAddActivity(day)}
                                text="Add Activity"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}