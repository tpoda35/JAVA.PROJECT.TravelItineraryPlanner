import { Box, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import {useApi} from "../../../../../Hooks/useApi.js";

// replace dummy members with API call
const dummyMembers = [
    { id: 1, username: "Alice" },
    { id: 2, username: "Bob" },
    { id: 3, username: "Charlie" },
];

export default function MembersTab({ tripId }) {
    const { del } = useApi();

    const handleKick = async (userId) => {
        try {
            await del(`/trips/${tripId}/members/${userId}`);
            // refresh member list after
        } catch (error) {
            console.error("Kick failed:", error);
        }
    };

    return (
        <Box>
            <Typography variant="subtitle1" gutterBottom>
                Members
            </Typography>
            <List>
                {dummyMembers.map((user) => (
                    <ListItem
                        key={user.id}
                        secondaryAction={
                            <IconButton edge="end" onClick={() => handleKick(user.id)}>
                                <Delete />
                            </IconButton>
                        }
                    >
                        <ListItemText primary={user.username} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
