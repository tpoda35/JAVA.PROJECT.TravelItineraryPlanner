import {useParams} from "react-router-dom";
import useTripPlanner from "./Hooks/useTripPlanner.js";

export default function TripPlanner() {
    const { tripId } = useParams();

    const planner = useTripPlanner(tripId);

    console.log(planner.trip);

    return (
        <>
            <h1 className="mt0-mr0-mb20-ml0">Planner</h1>

        </>
    )
}