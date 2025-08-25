import { useEffect, useRef, useState, useCallback } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { useTripPlannerContext } from "../../Contexts/TripPlannerContext";

export default function TripNoteItem({ note, tripId }) {
    const { sendMessage } = useTripPlannerContext();
    const [editing, setEditing] = useState(note.isNew || false);
    const [editValue, setEditValue] = useState(note.content || "");
    const inputRef = useRef(null);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    const handleUpdate = useCallback(
        (updatedContent) => {
            const payload = {
                type: "NOTE_UPDATED",
                noteId: note.id,
                noteDetailsDto: { ...note, content: updatedContent },
            };

            sendMessage(`/app/trips/${tripId}/notes`, JSON.stringify(payload));
        },
        [note, tripId, sendMessage]
    );

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (editValue !== note.content) {
                handleUpdate(editValue);
            }
            setEditing(false);
        } else if (e.key === "Escape") {
            setEditValue(note.content);
            setEditing(false);
        }
    };

    return (
        <Box
            mb={2}
            p={2}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
                cursor: "pointer",
            }}
            onClick={() => setEditing(true)}
        >
            {editing ? (
                <TextField
                    inputRef={inputRef}
                    variant="standard"
                    fullWidth
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => setEditing(false)}
                />
            ) : (
                <Typography
                    color="text.secondary"
                    sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                    }}
                >
                    {note.content || "Click to add note..."}
                </Typography>
            )}
        </Box>
    );
}
