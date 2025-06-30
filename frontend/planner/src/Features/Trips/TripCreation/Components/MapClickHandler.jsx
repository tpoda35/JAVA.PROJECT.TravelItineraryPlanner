import {useMapEvents} from "react-leaflet";

export default function MapClickHandler({ onLocationSelect, reverseGeocode, setIsGeocoding }) {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;

            if (setIsGeocoding) setIsGeocoding(true);

            const locationName = await reverseGeocode(lat, lng);
            onLocationSelect({
                coords: [lat, lng],
                name: locationName
            });

            if (setIsGeocoding) setIsGeocoding(false);
        },
    });

    return null;
}