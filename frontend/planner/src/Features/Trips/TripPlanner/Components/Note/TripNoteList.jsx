import {Box, IconButton, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TripNoteItem from "./TripNoteItem";
import {useCallback} from "react";

export default function TripNoteList({ tripNotes, tripId, sendMessage }) {
    const handleAddNote = useCallback(() => {
        const payload = { type: "NOTE_CREATED" };
        sendMessage(`/app/trips/${tripId}/notes`, JSON.stringify(payload));
    }, [sendMessage, tripId]);

    console.log("TripNoteList render.");

    return (
        <Box mt={2}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                    Notes
                </Typography>
                <IconButton
                    aria-label="Add note"
                    color="success"
                    onClick={handleAddNote}
                    title="Create note"
                >
                    <AddIcon />
                </IconButton>
            </Box>

            {tripNotes?.length === 0 ? (
                <Typography color="text.secondary">No notes available.</Typography>
            ) : (
                tripNotes?.map((note) => (
                    <TripNoteItem key={note.id} note={note} tripId={tripId} />
                ))
            )}
        </Box>
    );
}
