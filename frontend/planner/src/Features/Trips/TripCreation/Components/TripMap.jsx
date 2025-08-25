import { MapContainer, TileLayer } from 'react-leaflet';
import MapClickHandler from './MapClickHandler.jsx';
import LocationMarker from './LocationMarker.jsx';

/**
 * Renders a Leaflet map for a trip, allowing users to view, select,
 * and mark locations. Includes interactive features such as clicking
 * on the map to choose a location and displaying a marker for the
 * selected point.
 *
 * @param {Array<number>} center - Initial center of the map as [latitude, longitude].
 * @returns {JSX.Element} A React component containing the interactive map.
 *
 * @example
 * <TripMap center={[51.505, -0.09]} />
 */
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
