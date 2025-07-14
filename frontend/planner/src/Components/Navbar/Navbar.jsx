import {Link} from "react-router-dom";
import KeycloakService from '../../Services/KeycloakService.js';
import {useContext} from "react";
import {AuthContext} from "../../Contexts/AuthContext.jsx";
import {Box, Button} from "@mui/material";

export default function Navbar() {
    const { authenticated } = useContext(AuthContext);

    const handleLogin = () => {
        KeycloakService.login();
    };

    const handleLogout = () => {
        KeycloakService.logout();
    };

    const handleRegister = () => {
        KeycloakService.register();
    };

    // const userInfo = authenticated ? KeycloakService.getUserInfo() : null;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button component={Link} to="/trip-manager" color="inherit">
                            Trips
                        </Button>
                        <Button component={Link} to="/dashboard" color="inherit">
                            Dashboard
                        </Button>
                    </Box>
                    <Button variant="outlined" color="primary" onClick={handleLogout}>
                        Log out
                    </Button>
                </>
            )}
        </Box>
    );
}