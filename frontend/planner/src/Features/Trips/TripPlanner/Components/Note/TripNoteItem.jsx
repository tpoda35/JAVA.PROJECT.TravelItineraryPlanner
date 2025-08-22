import {Box, Typography} from "@mui/material";

export default function TripNoteItem({ note }) {


    return (
        <Box
            mb={2}
            p={2}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
            }}
        >
            {/*<IconButton*/}
            {/*    size="small"*/}
            {/*    onClick={(e) => {*/}
            {/*        e.stopPropagation();*/}
            {/*        onDeleteNote(folder.id);*/}
            {/*    }}*/}
            {/*    title="Delete"*/}
            {/*>*/}
            {/*    <Delete />*/}
            {/*</IconButton>*/}
            <Typography
                color="text.secondary"
                sx={{
                    whiteSpace: "pre-wrap",  // keeps line breaks from backend
                    wordBreak: "break-word", // breaks long words if needed
                }}
            >
                {note.content}
            </Typography>
        </Box>
    );
}