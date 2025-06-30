import {Marker, Popup} from "react-leaflet";

export default function LocationMarker({ coords, destination }) {
    return coords ? (
        <Marker position={coords}>
            <Popup>{destination}</Popup>
        </Marker>
    ) : null;
}