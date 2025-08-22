import { useSharedWebSocket } from "../../../../Contexts/WebSocketContext.jsx";
import { useEffect } from "react";

export default function useTripNotesWebSocket(tripId, setTrip) {
    const { subscribe, sendMessage, isConnected } = useSharedWebSocket();

    useEffect(() => {
        if (!isConnected || tripId === null) return;

        const destination = `/topic/trips/${tripId}/notes`;

        const unsub = subscribe(
            destination,
            (message) => {
                try {
                    const response = JSON.parse(message.body);
                    const type = response.type;
                    const noteId = response.noteId;
                    const content = response.content;

                    setTrip((prevTrip) => {
                        if (!prevTrip) return prevTrip;

                        const currentNotes = Array.isArray(prevTrip.tripNotes) ? prevTrip.tripNotes : [];
                        let updatedTripNotes = currentNotes;

                        switch (type) {
                            case 'NOTE_CREATED': {
                                // Check if note already exists to avoid duplicates
                                if (currentNotes.some((note) => note.id === noteId)) {
                                    return prevTrip;
                                }
                                const newNote = { id: noteId, content };
                                updatedTripNotes = [...currentNotes, newNote];
                                break;
                            }

                            case 'NOTE_UPDATED': {
                                updatedTripNotes = currentNotes.map((note) =>
                                    note.id === noteId ? { ...note, content } : note
                                );
                                break;
                            }

                            case 'NOTE_DELETED': {
                                updatedTripNotes = currentNotes.filter((note) => note.id !== noteId);
                                break;
                            }

                            default:
                                return prevTrip;
                        }

                        return { ...prevTrip, tripNotes: updatedTripNotes };
                    });
                } catch (e) {
                    console.error('Error parsing note message:', e);
                }
            },
            {},
            { replace: true }
        );

        return () => {
            if (typeof unsub === 'function') {
                try {
                    unsub();
                } catch (e) {
                    console.error('Error unsubscribing from notes:', e);
                }
            }
        };
    }, [isConnected, subscribe, tripId, setTrip]);

    return { sendMessage, isConnected };
}