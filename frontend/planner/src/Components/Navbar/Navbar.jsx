import './Navbar.css'
import {Link} from "react-router-dom";
import KeycloakService from '../../keycloak/KeycloakService.js';

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
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/features" className="nav-link">Features</Link>
                <Link to="/howitworks" className="nav-link">How it works</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
            </div>

            <div className="navbar-container-1">
                {!authenticated ? (
                    <>
                        <button
                            onClick={handleLogin}
                            className="nav-link nav-button"
                        >
                            Log in
                        </button>
                        <button
                            onClick={handleRegister}
                            className="nav-link nav-button"
                        >
                            Register
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <button
                            onClick={handleLogout}
                            className="nav-link nav-button"
                        >
                            Log out
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar