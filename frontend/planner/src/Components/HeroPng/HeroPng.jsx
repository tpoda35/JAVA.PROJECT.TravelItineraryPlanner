import backGroundImage from "../../assets/heropng.jpg";
import './HeroPng.css'

export default function HeroPng({children}) {
    return (
        <div className="heroPng-container" style={{backgroundImage: `url(${backGroundImage})`}}>
            {children}
        </div>
    )
}