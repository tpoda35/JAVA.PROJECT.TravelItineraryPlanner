import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TripNoteItem from "./TripNoteItem";
import { useTripPlannerContext } from "../../Contexts/TripPlannerContext";

export default function TripNoteList({ tripNotes }) {
    const { sendMessage, tripId } = useTripPlannerContext();
    const [notes, setNotes] = useState(tripNotes || []);

    const handleAddNote = () => {
        const newNote = {
            id: Date.now(), // temporary ID (replace with backend response)
            content: "",
            isNew: true, // marker to auto-focus on new note
        };

        setNotes((prev) => [...prev, newNote]);

        // Push to backend immediately
        const payload = {
            type: "NOTE_CREATED",
            tripId,
            noteDetailsDto: newNote,
        };

        sendMessage(`/app/trips/${tripId}/notes`, JSON.stringify(payload));
    };

    return (
        <Box mt={2}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Notes
                </Typography>
                <IconButton color="primary" onClick={handleAddNote}>
                    <AddIcon />
                </IconButton>
            </Box>

            {notes.length === 0 ? (
                <Typography color="text.secondary">No notes available.</Typography>
            ) : (
                notes.map((note) => (
                    <TripNoteItem key={note.id} note={note} tripId={tripId} />
                ))
            )}
        </Box>
    );
}
