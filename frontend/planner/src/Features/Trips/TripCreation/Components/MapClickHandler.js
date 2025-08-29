import { useMapEvents } from "react-leaflet";
import { useTripCreationProvider } from "../Contexts/TripCreationContext.jsx";
import { reverseGeocode } from "../Utils/Geocoding.js";
import { memo } from "react";

/**
 * Handles map click events for selecting a trip destination.
 *
 * Listens for clicks on the map, performs reverse geocoding to obtain
 * the location name, and updates the parent state with the selected
 * coordinates and name. Also manages a geocoding loading state.
 *
 * @param {Function} setDestination - Setter for the destination name.
 * @param {Function} setDestinationCoords - Setter for the destination coordinates.
 * @param {Object} formErrors - Validation errors.
 * @param {Function} setFormErrors - Setter for validation errors.
 * @returns {null} This component does not render any visible elements.
 */
const MapClickHandler = ({
                             setDestination,
                             setDestinationCoords,
                             formErrors,
                             setFormErrors,
                         }) => {
    const { setLoading } = useTripCreationProvider();

    const handleLocationSelect = ({ coords, name }) => {
        setDestination(name);
        setDestinationCoords(coords);

        if (formErrors.destination) {
            setFormErrors((prev) => ({
                ...prev,
                destination: "",
            }));
        }
    };

    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;

            if (setLoading) setLoading(true);

            const locationName = await reverseGeocode(lat, lng);
            handleLocationSelect({
                coords: [lat, lng],
                name: locationName,
            });

            if (setLoading) setLoading(false);
        },
    });

    return null;
};

export default memo(MapClickHandler);
