import './Navbar.css'
import {Link} from "react-router-dom";
import KeycloakService from '../../Services/KeycloakService.js';

function Navbar({ authenticated }) {
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
        <nav className="center-full">
            {!authenticated ? (
                <>
                    <button
                        onClick={handleLogin}
                        className="nav-button"
                    >
                        Log in
                    </button>
                    <button
                        onClick={handleRegister}
                        className="nav-button"
                    >
                        Register
                    </button>
                </>
            ) : (
                <>
                    <div className="navbar-btns-container">
                        <Link to="/trip-manager">Trips</Link>
                        <Link to="/dashboard">Dashboard</Link>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="nav-button"
                    >
                        Log out
                    </button>
                </>
            )}
        </nav>
    );
}

export default Navbar