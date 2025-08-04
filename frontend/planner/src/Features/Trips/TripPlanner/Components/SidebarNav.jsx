import {useState} from "react";
import {Box, Button, List, ListItemButton, ListItemText, TextField, Typography} from "@mui/material";
import {useApi} from "../../../../Hooks/useApi.js";

export default function SidebarNav({ sections, activeSection, onClick, buttonRefs, theme, tripId }) {
    const [inviteUsername, setInviteUsername] = useState("");
    const [isSending, setIsSending] = useState(false);
    const { post } = useApi();

    const handleInvite = async () => {
        if (!inviteUsername || !tripId) return;

        try {
            await post(`/activities/invite/${tripId}`, { username: inviteUsername });
            setInviteUsername("");
        } catch (error) {
            console.error("Invite failed:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Box
            sx={{
                width: 200,
                p: 2,
                bgcolor: theme.palette.background.paper,
                flexShrink: 0,
                position: "sticky",
                top: 0,
                height: "fit-content"
            }}
        >
            <Typography variant="h6" gutterBottom>
                Navigate
            </Typography>
            <List>
                {sections.map(({ key, label }) => (
                    <ListItemButton
                        key={key}
                        ref={buttonRefs[key]}
                        selected={activeSection === key}
                        onClick={() => onClick(key)}
                        sx={{
                            borderRadius: 1,
                            mb: 0.5,
                            "&.Mui-selected": {
                                bgcolor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                "&:hover": {
                                    bgcolor: theme.palette.primary.dark
                                }
                            }
                        }}
                    >
                        <ListItemText primary={label} />
                    </ListItemButton>
                ))}
            </List>

            {/* Invite Form */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Invite user
                </Typography>
                <TextField
                    size="small"
                    placeholder="Username"
                    fullWidth
                    value={inviteUsername}
                    onChange={(e) => setInviteUsername(e.target.value)}
                    sx={{ mb: 1 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleInvite}
                    disabled={!inviteUsername || isSending}
                >
                    {isSending ? "Sending..." : "Send Invite"}
                </Button>
            </Box>
        </Box>
    );
}
