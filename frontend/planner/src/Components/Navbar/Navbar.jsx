import './Navbar.css'
import {Link} from "react-router-dom";
import KeycloakService from '../../Services/KeycloakService.js';
import {useContext} from "react";
import {AuthContext} from "../../Contexts/AuthContext.jsx";
import CustomButton from "../Buttons/CustomButton.jsx";

function Navbar() {
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
        <nav className="center-full">
            {!authenticated ? (
                <>
                    <CustomButton
                        onClick={handleLogin}
                        className="nav-button"
                        text="Log in"
                    />
                    <CustomButton
                        onClick={handleRegister}
                        className="nav-button"
                        text="Register"
                    />
                </>
            ) : (
                <>
                    <div className="navbar-btns-container">
                        <Link to="/trip-manager">Trips</Link>
                        <Link to="/dashboard">Dashboard</Link>
                    </div>
                    <CustomButton
                        onClick={handleLogout}
                        className="nav-button"
                        text="Log out"
                    />
                </>
            )}
        </nav>
    );
}

export default Navbar