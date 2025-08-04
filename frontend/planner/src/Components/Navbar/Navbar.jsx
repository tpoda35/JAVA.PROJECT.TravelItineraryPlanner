import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {Badge, Box, Button, IconButton, Menu, MenuItem, Typography,} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {AuthContext} from "../../Contexts/AuthContext.jsx";
import KeycloakService from "../../Services/KeycloakService.js";
import useWebSocket from "../../Hooks/useWebSocket";
import {useApi} from "../../Hooks/useApi.js";

export default function Navbar() {
    const { authenticated } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [invites, setInvites] = useState([]);

    const { get, post } = useApi();

    const {
        connect,
        subscribe,
        isConnected,
    } = useWebSocket();

    useEffect(() => {
        if (!authenticated) return;

        let unsubscribeFn;

        // Sub to the notifications channel
        connect().then(() => {
            if (!isConnected) return;

            const destination = `/user/queue/notifications`;
            unsubscribeFn = subscribe(destination, (message) => {
                try {
                    const notification = JSON.parse(message.body);
                    setNotifications((prev) => [notification, ...prev]);
                } catch (error) {
                    console.error("Failed to parse notification:", error);
                }
            });
        });

        // Load the pending invites
        const fetchInvites = async () => {
            try {
                const data = await get("/api/invites/pending");
                setInvites(data);
            } catch (err) {
                console.error("Error loading invites:", err);
            }
        };

        fetchInvites();

        return () => {
            if (typeof unsubscribeFn === "function") {
                unsubscribeFn();
            }
        };
    }, [authenticated, connect, subscribe, isConnected]);

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

    // Accept or reject invite
    const respondToInvite = async (token, accept) => {
        try {
            await post(`/api/invites/${accept ? "accept" : "reject"}?token=${token}`);
            setInvites((prev) => prev.filter((i) => i.inviteToken !== token));
        } catch (err) {
            console.error("Invite error:", err);
        }
    };

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

                        {/* 🔔 Notification Icon + Dropdown */}
                        <IconButton color="inherit" onClick={handleOpenNotifications}>
                            <Badge badgeContent={notifications.length + invites.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseNotifications}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                        >
                            {/* 📨 Invites Section */}
                            {invites.length > 0 && (
                                <>
                                    <MenuItem disabled>
                                        <Typography variant="subtitle2">Trip Invitations</Typography>
                                    </MenuItem>
                                    {invites.map((invite) => (
                                        <MenuItem
                                            key={invite.inviteToken}
                                            sx={{ flexDirection: "column", alignItems: "flex-start" }}
                                        >
                                            <Typography variant="body2">
                                                You're invited to: <b>{invite.tripName || "a trip"}</b>
                                            </Typography>
                                            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => respondToInvite(invite.inviteToken, true)}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => respondToInvite(invite.inviteToken, false)}
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                    <MenuItem divider />
                                </>
                            )}

                            {/* 🛎️ Notifications Section */}
                            {notifications.length === 0 && invites.length === 0 ? (
                                <MenuItem disabled>
                                    <Typography variant="body2">No new notifications</Typography>
                                </MenuItem>
                            ) : (
                                notifications.map((n, idx) => (
                                    <MenuItem key={idx} onClick={handleCloseNotifications}>
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
