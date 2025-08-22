import React from 'react';
import { Box, Typography } from '@mui/material';
import TripNoteItem from './TripNoteItem.jsx';

export default function TripNoteList({ tripNotes }) {
    if (!tripNotes || tripNotes.length === 0) {
        return <Typography color="text.secondary">No notes available.</Typography>;
    }

    return (
        <Box mt={2}>
            {tripNotes.map((note) => (
                <TripNoteItem
                    key={note.id}
                    note={note}
                />
            ))}
        </Box>
    );
}