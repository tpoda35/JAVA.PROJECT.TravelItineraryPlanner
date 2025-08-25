import {Marker, Popup} from "react-leaflet";
import {useTripCreationContext} from "../Contexts/TripCreationContext.js";

/**
 * Displays a marker on the Leaflet map for the currently selected
 * trip destination. Shows a popup with the destination name when
 * the marker is clicked.
 *
 * @returns {JSX.Element|null} A Marker component if a destination is selected, otherwise null.
 *
 * @example
 * <LocationMarker />
 */
export default function LocationMarker() {
    const {formData} = useTripCreationContext();

    return formData.destinationCoords ? (
        <Marker position={formData.destinationCoords}>
            <Popup>{formData.destination}</Popup>
        </Marker>
    ) : null;
}