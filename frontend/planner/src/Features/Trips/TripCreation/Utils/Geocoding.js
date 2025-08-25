/**
 * Performs reverse geocoding to obtain a human-readable location name
 * from latitude and longitude coordinates using the OpenStreetMap Nominatim API.
 *
 * @param {number} lat - Latitude of the location.
 * @param {number} lng - Longitude of the location.
 * @returns {Promise<string>} A promise that resolves to the location name,
 *                            or 'Unknown' if the reverse geocoding fails.
 *
 * @example
 * const name = await reverseGeocode(51.505, -0.09);
 * console.log(name); // e.g., "London, United Kingdom"
 */
export async function reverseGeocode(lat, lng) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
        );

        if (!response.ok) {
            throw new Error('Geocoding failed');
        }

        const data = await response.json();

        // Format the address based on available information
        const address = data.address;
        let displayName = '';

        if (address.city || address.town || address.village) {
            displayName = address.city || address.town || address.village;
            if (address.country) {
                displayName += `, ${address.country}`;
            }
        } else if (address.road && address.house_number) {
            displayName = `${address.road} ${address.house_number}`;
            if (address.postcode || address.city) {
                displayName += `, ${address.postcode || address.city}`;
            }
        } else {
            displayName = data.display_name.split(',')[0] || 'Unknown';
        }

        return displayName;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return 'Unknown';
    }
}