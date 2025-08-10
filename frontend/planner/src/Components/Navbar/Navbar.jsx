import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
    Badge,
    Box,
    Button,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AuthContext } from "../../Contexts/AuthContext.jsx";
import KeycloakService from "../../Services/KeycloakService.js";
import useWebSocket from "../../Hooks/useWebSocket";
import { useApi } from "../../Hooks/useApi.js";

export default function Navbar() {
    const { authenticated } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [invites, setInvites] = useState([]);

    const { get, post } = useApi();
    const { connect, subscribe } = useWebSocket();
    const navigate = useNavigate();

    const MAX_VISIBLE = 5;

    useEffect(() => {
        if (!authenticated) return;

        let unsubscribeFn;

        const initialize = async () => {
            try {
                await connect();

                const destination = `/user/queue/notifications`;
                unsubscribeFn = subscribe(destination, (message) => {
                    try {
                        const notification = JSON.parse(message.body);

                        if (notification.notificationType === "INVITE") {
                            setInvites((prev) => {
                                const filtered = prev.filter((i) => i.id !== notification.content.id);
                                return [notification.content, ...filtered].slice(0, MAX_VISIBLE);
                            });
                        } else {
                            setNotifications((prev) => {
                                const filtered = prev.filter((n) => n.id !== notification.id);
                                return [notification, ...filtered].slice(0, MAX_VISIBLE);
                            });
                        }
                    } catch (error) {
                        console.error("Failed to parse notification:", error);
                    }
                });

                const data = await get(`/activities/invite/pending?page=0&size=${MAX_VISIBLE}`);
                setInvites(Array.isArray(data.content) ? data.content.slice(0, MAX_VISIBLE) : []);
            } catch (err) {
                console.error("WebSocket or invite fetch failed:", err);
            }
        };

        initialize();

        return () => {
            if (typeof unsubscribeFn === "function") {
                unsubscribeFn();
            }
        };
    }, [authenticated]);

    const handleOpenNotifications = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseNotifications = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        KeycloakService.login();
    };

    const handleLogout = () => {
        KeycloakService.logout();
    };

    const handleRegister = () => {
        KeycloakService.register();
    };

    const respondToInvite = async (inviteId, accept) => {
        try {
            await post(`/api/invites/${accept ? "accept" : "reject"}/${inviteId}`);
            setInvites((prev) => prev.filter((i) => i.id !== inviteId));
        } catch (err) {
            console.error("Invite error:", err);
        }
    };

    const totalBadgeCount = (notifications?.length || 0) + (invites?.length || 0);

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!authenticated ? (
                <>
                    <Button variant="contained" color="primary" onClick={handleLogin}>
                        Log in
                    </Button>
                    <Button variant="outlined" color="primary" onClick={handleRegister}>
                        Register
                    </Button>
                </>
            ) : (
                <>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Button component={Link} to="/trip-manager" color="inherit">
                            Trips
                        </Button>
                        <Button component={Link} to="/dashboard" color="inherit">
                            Dashboard
                        </Button>
                        <Button component={Link} to="/inbox" color="inherit">
                            Inbox
                        </Button>

                        <IconButton color="inherit" onClick={handleOpenNotifications}>
                            <Badge badgeContent={totalBadgeCount} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseNotifications}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            slotProps={{
                                paper: {
                                    sx: {
                                        maxHeight: 360,
                                        width: 380,
                                    },
                                },
                            }}
                        >
                            {invites?.length > 0 && [
                                <MenuItem disabled key="invites-title">
                                    <Typography variant="subtitle2">Trip Invitations</Typography>
                                </MenuItem>,

                                ...invites.map((invite) => (
                                    <MenuItem
                                        key={invite.id}
                                        sx={{
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            whiteSpace: "normal",
                                        }}
                                    >
                                        <Typography variant="body2">
                                            You're invited to collaborate in{" "}
                                            <b>{invite.tripName || "a trip"}</b>
                                            <br />
                                            by <b>{invite.inviterUsername || "a user."}</b>
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() => respondToInvite(invite.id, true)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => respondToInvite(invite.id, false)}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    </MenuItem>
                                )),

                                <MenuItem
                                    key="view-all"
                                    onClick={() => {
                                        handleCloseNotifications();
                                        navigate("/invites");
                                    }}
                                >
                                    <Typography variant="body2" color="primary">
                                        View all invites
                                    </Typography>
                                </MenuItem>,

                                <Divider key="divider" />,
                            ]}

                            {notifications.length === 0 && invites.length === 0 ? (
                                <MenuItem disabled>
                                    <Typography variant="body2">No new notifications</Typography>
                                </MenuItem>
                            ) : (
                                notifications.map((n, idx) => (
                                    <MenuItem key={`notif-${idx}`} onClick={handleCloseNotifications}>
                                        {n.message || "New Notification"}
                                    </MenuItem>
                                ))
                            )}
                        </Menu>

                        <Button variant="outlined" color="primary" onClick={handleLogout}>
                            Log out
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
}
