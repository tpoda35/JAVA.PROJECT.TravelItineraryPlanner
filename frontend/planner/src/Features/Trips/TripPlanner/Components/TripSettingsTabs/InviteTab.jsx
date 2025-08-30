import {useCallback, useState} from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import {useApi} from "../../../../../Hooks/useApi.js";
import {getErrorMessage} from "../../../../../Utils/getErrorMessage.js";

export default function InviteTab({ tripId }) {
    const [inviteUsername, setInviteUsername] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");
    const { post } = useApi();

    const handleInvite = async () => {
        if (!inviteUsername || !tripId) return;
        setIsSending(true);

        try {
            await post(`/trips/invites/${tripId}`, { username: inviteUsername });
            setInviteUsername("");
        } catch (error) {
            setError(getErrorMessage(error, 'Failed to send invite.'));
        } finally {
            setIsSending(false);
        }
    };

    const handleChange = useCallback((e) => {
        setInviteUsername(e.target.value);
        if (error) setError("");
    }, [error]);

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
                onChange={handleChange}
                sx={{ mb: 1 }}
                error={!!error}
                helperText={error || ' '}
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
