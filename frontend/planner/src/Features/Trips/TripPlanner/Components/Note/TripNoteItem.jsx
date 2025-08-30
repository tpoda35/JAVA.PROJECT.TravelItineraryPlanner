import {useEffect, useRef} from "react";
import {Box, TextField, Typography} from "@mui/material";
import {useEditableField} from "../../Hooks/useEditableField.js";
import {useSharedWebSocket} from "../../../../../Contexts/WebSocketContext.jsx";

export default function TripNoteItem({ note, tripId }) {
    const { sendMessage } = useSharedWebSocket();
    const inputRef = useRef(null);

    const handleUpdate = (updatedContent) => {
        const payload = {
            type: "NOTE_UPDATED",
            noteId: note.id,
            content: updatedContent
        };
        sendMessage(`/app/trips/${tripId}/notes`, JSON.stringify(payload));
    };

    const {
        isEditing,
        editValue,
        setEditValue,
        startEditing,
        handleKeyDown,
        handleBlur
    } = useEditableField(
        note.content,
        handleUpdate,
        null, // onCancel
        true, // resetOnCancel
        false // autoSave
    );

    // Auto-focus when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

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
            onClick={startEditing}
        >
            {isEditing ? (
                <TextField
                    inputRef={inputRef}
                    variant="standard"
                    fullWidth
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
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