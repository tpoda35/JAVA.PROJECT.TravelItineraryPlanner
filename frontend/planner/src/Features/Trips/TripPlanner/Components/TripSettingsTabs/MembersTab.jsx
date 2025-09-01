import {Box, IconButton, List, ListItem, ListItemText, Pagination, Typography,} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useApi} from "../../../../../Hooks/useApi.js";
import {useState} from "react";

export default function MembersTab({ tripId, membersPage, setMembersPage, currentPage }) {
    const { del } = useApi();
    const [kickingIds, setKickingIds] = useState([]);

    const handleKick = async (collaboratorId) => {
        if (kickingIds.includes(collaboratorId)) return; // prevent double click
        setKickingIds(prev => [...prev, collaboratorId]);

        try {
            await del(`/trips/${tripId}/collaborators/${collaboratorId}`);

            // Optimistically remove user from local state
            setMembersPage(prev => ({
                ...prev,
                content: prev.content.filter(user => user.collaboratorId !== collaboratorId),
                totalElements: prev.totalElements - 1,
            }));
        } catch (error) {
            console.error("Kick failed:", error);
        } finally {
            setKickingIds(prev => prev.filter(id => id !== collaboratorId));
        }
    };

    return (
        <Box>
            <Typography variant="subtitle1" gutterBottom>
                Members
            </Typography>

            <List>
                {membersPage?.content.map((user) => (
                    <ListItem
                        key={user.collaboratorId}
                        secondaryAction={
                            user.role !== "OWNER" ? (
                                <IconButton
                                    edge="end"
                                    onClick={() => handleKick(user.collaboratorId)}
                                    disabled={kickingIds.includes(user.collaboratorId)}
                                >
                                    <Delete />
                                </IconButton>
                            ) : null
                        }
                    >
                        <ListItemText
                            primary={user.username}
                            secondary={user.role}
                        />
                    </ListItem>
                ))}
            </List>

            {membersPage?.totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={membersPage.totalPages}
                        page={currentPage + 1}
                        onChange={(_, val) => setMembersPage(prev => prev)}
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
}
