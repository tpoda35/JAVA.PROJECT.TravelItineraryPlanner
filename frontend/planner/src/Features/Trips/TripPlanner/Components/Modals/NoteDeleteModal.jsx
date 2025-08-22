import { useTripPlannerContext } from "../../Contexts/TripPlannerContext.js";
import { useCallback } from "react";
import ConfirmModal from "../../../../../Components/Modal/ConfirmModal.jsx";

export default function NoteDeleteModal() {
    const {
        showNoteDeleteModal,
        setShowNoteDeleteModal,
        sendMessage,
        tripId,
        noteToDelete
    } = useTripPlannerContext();

    const handleDeleteNote = useCallback(() => {
        const payload = {
            type: "NOTE_DELETED",
            noteId: noteToDelete
        };

        sendMessage(`/app/trips/${tripId}`, JSON.stringify(payload));
        setShowNoteDeleteModal(false);
    }, [tripId, sendMessage]);

    return (
        <ConfirmModal
            open={showNoteDeleteModal}
            title="Delete Note"
            content="Are you sure?"
            onCancel={() => setShowNoteDeleteModal(false)}
            onConfirm={handleDeleteNote}
            confirmText="Delete"
            confirmColor="error"
        />
    );
}
