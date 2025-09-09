import TripPlannerContent from "./TripPlannerContent.jsx";
import {useParams} from "react-router-dom";
import {TripDataProvider} from "./Contexts/TripDataContext.jsx";
import {TripDayWsProvider} from "./Contexts/TripDayWebSocketContext.jsx";
import {TripNotesWsProvider} from "./Contexts/TripNotesWebSocketContext.jsx";
import {ActivityModalsProvider} from "./Contexts/ActivityModalsContext.jsx";
import {NoteModalsProvider} from "./Contexts/NoteModalsContext.jsx";
import {AccommodationModalsProvider} from "./Contexts/AccommodationModalsContext.jsx";

export default function TripPlanner() {
    const { tripId } = useParams();

    return (
        <TripDataProvider tripId={tripId}>
            <TripDayWsProvider tripId={tripId}>
                <TripNotesWsProvider tripId={tripId}>
                    <ActivityModalsProvider>
                        <AccommodationModalsProvider>
                            <NoteModalsProvider>
                                <TripPlannerContent />
                            </NoteModalsProvider>
                        </AccommodationModalsProvider>
                    </ActivityModalsProvider>
                </TripNotesWsProvider>
            </TripDayWsProvider>
        </TripDataProvider>
    );
}
