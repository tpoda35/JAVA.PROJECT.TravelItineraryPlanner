import { Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import {useApi} from "../../../../../Hooks/useApi.js";

// replace dummy members with API call
const dummyMembers = [
    { id: 1, username: "Alice", role: "member" },
    { id: 2, username: "Bob", role: "admin" },
];

export default function RolesTab({ tripId }) {
    const { patch } = useApi();

    const handleRoleChange = async (userId, role) => {
        try {
            await patch(`/trips/${tripId}/members/${userId}`, { role });
        } catch (error) {
            console.error("Role update failed:", error);
        }
    };

    return (
        <Box>
            <Typography variant="subtitle1" gutterBottom>
                Roles
            </Typography>
            <List>
                {dummyMembers.map((user) => (
                    <ListItem key={user.id}>
                        <ListItemText primary={`${user.username} (${user.role})`} />
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleRoleChange(user.id, "admin")}
                            sx={{ mr: 1 }}
                        >
                            Make Admin
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleRoleChange(user.id, "member")}
                        >
                            Make Member
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
