import {useCallback} from "react";
import ConfirmModal from "../../../../../Components/Modal/ConfirmModal.jsx";
import {useNoteModalsProvider} from "../../Contexts/NoteModalsContext.jsx";
import {useParams} from "react-router-dom";
import {useSharedWebSocket} from "../../../../../Contexts/WebSocketContext.jsx";

export default function NoteDeleteModal() {
    const { tripId } = useParams();
    const { sendMessage } = useSharedWebSocket();
    const {
        showNoteDeleteModal,
        setShowNoteDeleteModal,
        noteToDelete
    } = useNoteModalsProvider();

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
