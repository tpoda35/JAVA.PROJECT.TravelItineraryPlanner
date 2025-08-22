import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import {useApi} from "../../../../../Hooks/useApi.js";

export default function InviteTab({ tripId }) {
    const [inviteUsername, setInviteUsername] = useState("");
    const [isSending, setIsSending] = useState(false);
    const { post } = useApi();

    const handleInvite = async () => {
        if (!inviteUsername || !tripId) return;
        setIsSending(true);

        try {
            await post(`/trips/invites/${tripId}`, { username: inviteUsername });
            setInviteUsername("");
        } catch (error) {
            console.error("Invite failed:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Box>
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
    );
}
