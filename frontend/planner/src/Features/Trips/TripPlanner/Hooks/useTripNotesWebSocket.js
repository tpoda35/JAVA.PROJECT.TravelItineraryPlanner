import { useSharedWebSocket } from "../../../../Contexts/WebSocketContext.jsx";
import { useEffect } from "react";

export default function useTripNotesWebSocket(tripId, setTripNotes) {
    const { subscribe, sendMessage, isConnected } = useSharedWebSocket();

    useEffect(() => {
        if (!isConnected || tripId == null) return;

        const destination = `/topic/trips/${tripId}/notes`;

        const unsub = subscribe(
            destination,
            (message) => {
                try {
                    const response = JSON.parse(message.body);
                    console.log("WS NOTE:", response);

                    const { type, noteId, content } = response;
                    const noteIdNumber = Number(noteId);

                    setTripNotes((prevNotes = []) => {
                        let updatedNotes = prevNotes;

                        switch (type) {
                            case "NOTE_CREATED":
                                if (prevNotes.some((note) => Number(note.id) === noteIdNumber)) {
                                    return prevNotes;
                                }
                                updatedNotes = [...prevNotes, { id: noteIdNumber, content }];
                                break;

                            case "NOTE_UPDATED":
                                updatedNotes = prevNotes.map((note) =>
                                    Number(note.id) === noteIdNumber ? { ...note, content } : note
                                );
                                break;

                            case "NOTE_DELETED":
                                updatedNotes = prevNotes.filter((note) => Number(note.id) !== noteIdNumber);
                                break;

                            default:
                                return prevNotes;
                        }

                        return updatedNotes;
                    });
                } catch (e) {
                    console.error("Error parsing note message:", e);
                }
            },
            {},
            { replace: true }
        );

        return () => {
            if (typeof unsub === "function") {
                try {
                    unsub();
                } catch (e) {
                    console.error("Error unsubscribing from notes:", e);
                }
            }
        };
    }, [isConnected, subscribe, tripId]);

    return { sendMessage, isConnected };
}
