import Navbar from "../../Components/Navbar/Navbar.jsx";
import './Header.css'
import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <h1 className="header-logo">
                    <Link to="/"><span className="header-highlight">Travary</span></Link>
                </h1>
                <Navbar />
            </div>
        </header>
    );
}

export default Header