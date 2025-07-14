import { MapContainer, TileLayer } from 'react-leaflet';
import MapClickHandler from './MapClickHandler.jsx';
import LocationMarker from './LocationMarker.jsx';

export default function TripMap({ center }) {
    return (
        <div className="map-container" style={{ height: 300 }}>
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler />
                <LocationMarker />
            </MapContainer>
        </div>
    );
}
