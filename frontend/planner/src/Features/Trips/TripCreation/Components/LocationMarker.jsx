import { Marker, Popup } from "react-leaflet";
import { memo } from "react";

/**
 * Displays a marker on the Leaflet map for the currently selected
 * trip destination. Shows a popup with the destination name when
 * the marker is clicked.
 *
 * @param {string} destination - Destination name.
 * @param {Array<number>|null} destinationCoords - Coordinates [lat, lng].
 * @returns {JSX.Element|null} A Marker component if a destination is selected, otherwise null.
 */
const LocationMarker = ({ destination, destinationCoords }) => {
    return destinationCoords ? (
        <Marker position={destinationCoords}>
            <Popup>{destination}</Popup>
        </Marker>
    ) : null;
};

export default memo(LocationMarker);
