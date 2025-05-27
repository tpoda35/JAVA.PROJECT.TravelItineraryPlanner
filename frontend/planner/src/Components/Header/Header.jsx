import Navbar from "../Navbar/Navbar.jsx";
import './Header.css'

function Header() {

    return(
        <header className="header">
            <h1 className="logo">
                <span className="highlight">Travel Itinerary Planner</span>
            </h1>
            <Navbar />
        </header>
    );
}

export default Header