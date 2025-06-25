import './Home.css'
import CustomButton from "../../Components/Buttons/CustomButton.jsx";

export default function Home() {
    return(
        <div className="center-full-column">
            <div className="home-main-container">
                <h1 className="bebas-neue-regular home-main-title-text">Dream. Plan. Explore.</h1>
                <p>Organize flights, hotels & activities in seconds.<br/> Invite friends to collaborate, vote on ideas, and build your dream itinerary as a team.</p>
            </div>
            <div className="center-full-column">
                <CustomButton text="Start planning now" className="button-highlighted"/>
                <CustomButton text="Learn more"/>
            </div>
        </div>
    )
}