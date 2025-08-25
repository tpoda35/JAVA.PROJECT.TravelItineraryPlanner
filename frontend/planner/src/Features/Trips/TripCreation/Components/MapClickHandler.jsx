import {useMapEvents} from "react-leaflet";
import {useTripCreationContext} from "../Contexts/TripCreationContext.js";
import {reverseGeocode} from "../Utils/Geocoding.js";

/**
 * Component that handles map click events for selecting a trip destination.
 *
 * Listens for clicks on the map, performs reverse geocoding to obtain the
 * location name, and updates the trip creation context with the selected
 * coordinates and name. Also manages a geocoding loading state.
 *
 * @returns {null} This component does not render any visible elements
 *
 * @example
 * <MapClickHandler />
 */
export default function MapClickHandler() {
    const {setIsGeocoding, handleLocationSelect} = useTripCreationContext();

    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;

            if (setIsGeocoding) setIsGeocoding(true);

            const locationName = await reverseGeocode(lat, lng);
            handleLocationSelect({
                coords: [lat, lng],
                name: locationName
            });

            if (setIsGeocoding) setIsGeocoding(false);
        },
    });

    return null;
}