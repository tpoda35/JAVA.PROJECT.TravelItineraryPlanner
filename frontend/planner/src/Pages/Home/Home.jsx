import './Home.css'
import Button from "../../Components/Buttons/Button.jsx";

export default function Home() {
    return(
        <div className="center-full-column">
            <div className="home-main-container">
                <h1 className="bebas-neue-regular home-main-title-text">Dream. Plan. Explore.</h1>
                <p>Organize flights, hotels & activities in seconds.<br/> Invite friends to collaborate, vote on ideas, and build your dream itinerary as a team.</p>
            </div>
            <div className="center-full-column">
                <Button text="Start planning now" className="button-highlighted"/>
                <Button text="Learn more"/>
            </div>
        </div>
    )
}