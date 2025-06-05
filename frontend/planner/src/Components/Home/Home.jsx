import './Home.css'
import Button1 from "../Buttons/Button1.jsx";
import HeroPng from "../HeroPng/HeroPng.jsx";

export default function Home() {
    return(
        <main className="home-main-container">
            <HeroPng>
                <h2 className="bebas-neue-regular home-main-title-text">Plan your own trip now, even with your friends!</h2>
                <Button1 text="Start planning now"/>
                <Button1 text="Learn more"/>
            </HeroPng>
        </main>
    )
}