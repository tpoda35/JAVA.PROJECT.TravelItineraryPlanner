import { MapContainer, TileLayer } from "react-leaflet";
import MapClickHandler from "./MapClickHandler.js";
import LocationMarker from "./LocationMarker.jsx";
import { memo } from "react";

/**
 * Renders a Leaflet map for a trip, allowing users to view, select,
 * and mark locations. Includes interactive features such as clicking
 * on the map to choose a location and displaying a marker for the
 * selected point.
 *
 * @param {string} destination - The selected destination name.
 * @param {Array<number>|null} destinationCoords - Coordinates [lat, lng].
 * @param {Function} setDestination - State setter for destination name.
 * @param {Function} setDestinationCoords - State setter for destination coordinates.
 * @param {Object} formErrors - Validation errors for the form.
 * @param {Function} setFormErrors - State setter for validation errors.
 * @returns {JSX.Element} A React component containing the interactive map.
 */
const TripMap = ({
                     destination,
                     destinationCoords,
                     setDestination,
                     setDestinationCoords,
                     formErrors,
                     setFormErrors,
                 }) => {

    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <MapClickHandler
                setDestination={setDestination}
                setDestinationCoords={setDestinationCoords}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
            />
            <LocationMarker
                destination={destination}
                destinationCoords={destinationCoords}
            />
        </MapContainer>
    );
};

export default memo(TripMap);
