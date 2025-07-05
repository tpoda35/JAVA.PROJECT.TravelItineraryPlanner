import {useParams} from "react-router-dom";
import useTripPlanner from "./Hooks/useTripPlanner.js";
import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen.jsx";
import {TripDaysList} from "./Components/TripDayList.jsx";
import {TripPlannerContext} from "./Contexts/TripPlannerContext.js";
import TripPlannerModals from "./Components/TripPlannerModals.jsx";

export default function TripPlanner() {
    const { tripId } = useParams();
    const planner = useTripPlanner(tripId);

    if (planner.loading || !planner.trip) return <LoadingScreen />;

    return (
        <TripPlannerContext.Provider value={planner} >
            <>
                {planner.loading && <LoadingScreen />}

                <h1 className="mt0-mr0-mb20-ml0">Planner</h1>
                <h2>{planner.trip.name}</h2>

                <TripDaysList
                    tripDays={planner.trip.tripDays}
                    expandedDays={planner.expandedDays}
                />

                <TripPlannerModals />
            </>
        </TripPlannerContext.Provider>
    )
}