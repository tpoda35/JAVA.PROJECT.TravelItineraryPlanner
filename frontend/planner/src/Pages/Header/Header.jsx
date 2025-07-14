import Navbar from "../../Components/Navbar/Navbar.jsx";
import { Link } from "react-router-dom";
import {AppBar, Toolbar, Typography} from "@mui/material";

export default function Header() {
    return (
        <AppBar position="static" sx={{ backgroundColor: 'background.paper', boxShadow: 'none', px: 2 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                    variant="h3"
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        fontFamily: '"Bebas Neue", sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        transform: 'translateY(3px)', // adjust as needed
                    }}
                >
                    Travary
                </Typography>

                <Navbar />
            </Toolbar>
        </AppBar>
    );
}