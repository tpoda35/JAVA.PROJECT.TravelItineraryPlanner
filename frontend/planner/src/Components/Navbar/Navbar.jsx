import React, {useCallback} from 'react';
import {Link} from 'react-router-dom';
import {Box, Button} from '@mui/material';
import {useSharedAuth} from '../../Contexts/AuthContext.jsx';
import KeycloakService from '../../Services/KeycloakService.js';
import NotificationsBadge from "./NotificationsBadge.jsx";

function Navbar() {
    const { authenticated } = useSharedAuth();

    const handleLogin = useCallback(() => KeycloakService.login(), []);
    const handleLogout = useCallback(() => {
        KeycloakService.logout();
    }, []);
    const handleRegister = useCallback(() => KeycloakService.register(), []);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!authenticated ? (
                <>
                    <Button variant="contained" color="primary" onClick={handleLogin}>Log in</Button>
                    <Button variant="outlined" color="primary" onClick={handleRegister}>Register</Button>
                </>
            ) : (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button component={Link} to="/trip-manager" color="inherit">Trips</Button>
                    <Button component={Link} to="/dashboard" color="inherit">Dashboard</Button>
                    <Button component={Link} to="/inbox" color="inherit">Inbox</Button>

                    {/* NotificationsBadge handles all notifications state internally */}
                    <NotificationsBadge />

                    <Button variant="outlined" color="primary" onClick={handleLogout}>Log out</Button>
                </Box>
            )}
        </Box>
    );
}

export default React.memo(Navbar);
