import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
} from "@mui/material";
import { useApi } from "../../../../../Hooks/useApi.js";
import {useState} from "react";

export default function RolesTab({ tripId, membersPage, setMembersPage }) {
    const { patch } = useApi();

    const [updatingRoleIds, setUpdatingRoleIds] = useState([]);

    const handleRoleChange = async (collaboratorId, newRole) => {
        if (updatingRoleIds.includes(collaboratorId)) return; // already updating

        setUpdatingRoleIds(prev => [...prev, collaboratorId]);

        try {
            await patch(`/trips/${tripId}/collaborators/${collaboratorId}/role`, { role: newRole });

            // update local state
            setMembersPage(prev => ({
                ...prev,
                content: prev.content.map(u =>
                    u.collaboratorId === collaboratorId ? { ...u, role: newRole } : u
                ),
            }));
        } catch (error) {
            console.error("Role update failed:", error);
        } finally {
            setUpdatingRoleIds(prev => prev.filter(id => id !== collaboratorId));
        }
    };

    return (
        <Box>
            <Typography variant="subtitle1" gutterBottom>
                Roles
            </Typography>
            <List>
                {membersPage?.content.map((user) => (
                    <ListItem key={user.collaboratorId}>
                        <ListItemText
                            primary={user.username}
                            secondary={user.role}
                        />
                        {user.role !== "OWNER" && (
                            <>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleRoleChange(user.collaboratorId, "EDITOR")}
                                    sx={{ mr: 1 }}
                                    disabled={updatingRoleIds.includes(user.collaboratorId)}
                                >
                                    Editor
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleRoleChange(user.collaboratorId, "VIEWER")}
                                    disabled={updatingRoleIds.includes(user.collaboratorId)}
                                >
                                    Viewer
                                </Button>
                            </>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

