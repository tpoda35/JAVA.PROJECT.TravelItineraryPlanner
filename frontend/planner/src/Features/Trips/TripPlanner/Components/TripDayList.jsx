import {TripDayItem} from "./TripDayItem.jsx";
import './TripDayList.css'

export function TripDaysList({ tripDays, expandedDays}) {
    if (!tripDays || tripDays.length === 0) {
        return <div>No trip days found</div>;
    }

    return (
        <div className="trip-days-list">
            <h3>Add activities to each day:</h3>
            {tripDays.map(day => {
                const isExpanded = expandedDays.has(day.id);

                return (
                    <TripDayItem
                        key={day.id}
                        day={day}
                        isExpanded={isExpanded}
                    />
                );
            })}
        </div>
    );
}