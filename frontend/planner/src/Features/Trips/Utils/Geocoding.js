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