import React, { useState, useEffect, useMemo } from 'react';
import { IconButton, Badge, Menu, MenuItem, Divider, Typography, Box, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSharedWebSocket } from '../../Contexts/WebSocketContext.jsx';
import { useApi } from '../../Hooks/useApi.js';
import { useNavigate } from 'react-router-dom';

const MAX_VISIBLE = 5;

function NotificationsBadge() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [invites, setInvites] = useState([]);
    const { connect, subscribe } = useSharedWebSocket();
    const { get, post } = useApi();
    const navigate = useNavigate();

    // Open / close menu
    const handleOpen = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    // Fetch pending invites on mount
    useEffect(() => {
        let mounted = true;
        const fetchInvites = async () => {
            try {
                const data = await get(`/trips/invites/pending?page=0&size=${MAX_VISIBLE}`);
                if (!mounted) return;
                const content = Array.isArray(data?.content) ? data.content : [];
                setInvites(content.slice(0, MAX_VISIBLE));
            } catch (err) {
                console.error('Failed to fetch invites:', err);
            }
        };
        fetchInvites();
        return () => { mounted = false; };
    }, []);

    // Subscribe to WebSocket notifications
    useEffect(() => {
        let unsubscribeFn;
        (async () => {
            try {
                await connect();
                unsubscribeFn = subscribe('/user/queue/notifications', (message) => {
                    try {
                        const notification = JSON.parse(message.body);
                        if (notification?.notificationType === 'INVITE') {
                            setInvites((prev) => [notification.content, ...prev.filter(i => i.id !== notification.content?.id)].slice(0, MAX_VISIBLE));
                        } else {
                            setNotifications((prev) => [notification, ...prev.filter(n => n.id !== notification.id)].slice(0, MAX_VISIBLE));
                        }
                    } catch (e) { console.error(e); }
                }, {}, { replace: true });
            } catch (err) { console.error('WS subscription failed', err); }
        })();

        return () => { if (typeof unsubscribeFn === 'function') unsubscribeFn(); };
    }, [connect, subscribe]);

    const respondToInvite = async (inviteId, accept) => {
        try {
            await post(`/trips/invites/${accept ? 'accept' : 'decline'}/${inviteId}`);
            setInvites((prev) => prev.filter(i => i.id !== inviteId));
        } catch (err) { console.error(err); }
    };

    const totalBadgeCount = useMemo(() => (notifications.length || 0) + (invites.length || 0), [notifications.length, invites.length]);

    return (
        <>
            <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={totalBadgeCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { maxHeight: 360, width: 380 } } }}
            >
                {invites.length > 0 && [
                    <MenuItem disabled key="invites-title"><Typography variant="subtitle2">Trip Invitations</Typography></MenuItem>,
                    ...invites.map(invite => (
                        <MenuItem key={invite.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', whiteSpace: 'normal' }}>
                            <Typography variant="body2">
                                You're invited to collaborate in <b>{invite.tripName || 'a trip'}</b> by <b>{invite.inviterUsername || 'a user'}</b>.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Button size="small" color="primary" onClick={() => respondToInvite(invite.id, true)}>Accept</Button>
                                <Button size="small" color="error" onClick={() => respondToInvite(invite.id, false)}>Decline</Button>
                            </Box>
                        </MenuItem>
                    )),
                    <MenuItem key="view-all" onClick={() => { handleClose(); navigate('/invites'); }}>
                        <Typography variant="body2" color="primary">View all invites</Typography>
                    </MenuItem>,
                    <Divider key="divider" />
                ]}

                {notifications.length === 0 && invites.length === 0 ? (
                    <MenuItem disabled><Typography variant="body2">No new notifications</Typography></MenuItem>
                ) : (
                    notifications.map((n, idx) => (
                        <MenuItem key={`notif-${idx}`} onClick={handleClose}>{n.message || 'New Notification'}</MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
}

export default React.memo(NotificationsBadge);
