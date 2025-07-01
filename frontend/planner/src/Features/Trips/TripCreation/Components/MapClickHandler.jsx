import {useMapEvents} from "react-leaflet";
import {useTripCreationContext} from "../Contexts/TripCreationContext.js";
import {reverseGeocode} from "../Utils/Geocoding.js";

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