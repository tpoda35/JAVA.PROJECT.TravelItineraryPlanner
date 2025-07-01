import {Marker, Popup} from "react-leaflet";
import {useTripCreationContext} from "../Contexts/TripCreationContext.js";

export default function LocationMarker() {
    const {formData} = useTripCreationContext();

    return formData.destinationCoords ? (
        <Marker position={formData.destinationCoords}>
            <Popup>{formData.destination}</Popup>
        </Marker>
    ) : null;
}