import TripPlannerContent from "./TripPlannerContent.jsx";
import {useParams} from "react-router-dom";
import {TripDataProvider} from "./Contexts/TripDataContext.jsx";
import {TripActivitiesWsProvider} from "./Contexts/TripActivitiesWebSocketContext.jsx";
import {TripNotesWsProvider} from "./Contexts/TripNotesWebSocketContext.jsx";
import {ActivityModalsProvider} from "./Contexts/ActivityModalsContext.jsx";
import {NoteModalsProvider} from "./Contexts/NoteModalsContext.jsx";

export default function TripPlanner() {
    const { tripId } = useParams();

    return (
        <TripDataProvider tripId={tripId}>
            <TripActivitiesWsProvider tripId={tripId}>
                <TripNotesWsProvider tripId={tripId}>
                    <ActivityModalsProvider>
                        <NoteModalsProvider>
                            <TripPlannerContent />
                        </NoteModalsProvider>
                    </ActivityModalsProvider>
                </TripNotesWsProvider>
            </TripActivitiesWsProvider>
        </TripDataProvider>
    );
}
