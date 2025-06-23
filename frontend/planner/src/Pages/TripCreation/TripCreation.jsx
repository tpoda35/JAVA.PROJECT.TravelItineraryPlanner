import { useState } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TripCreation.css';
import './datepicker.css'
import CustomInput from "../../Components/Input/CustomInput.jsx";

// Map marker
const DefaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper function for reverse geocoding
async function reverseGeocode(lat, lng) {
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
            displayName = data.display_name.split(',')[0] || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        }

        return displayName;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    }
}

export default function TripCreation() {
    const { folderId } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        destination: '',
        destinationCoords: null,
        startDate: null,
        endDate: null
    });
    const [errors, setErrors] = useState({
        name: '',
        destination: '',
        dates: ''
    });
    const [isGeocoding, setIsGeocoding] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setFormData(prev => ({
            ...prev,
            startDate: start,
            endDate: end
        }));

        if (errors.dates) {
            setErrors(prev => ({
                ...prev,
                dates: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let valid = true;
        const newErrors = {
            name: '',
            destination: '',
            dates: ''
        };

        if (!formData.name.trim()) {
            newErrors.name = 'Name field cannot be empty.';
            valid = false;
        } else if (formData.name.length > 100) {
            newErrors.name = 'Name must be 100 characters or less.';
            valid = false;
        }

        if (!formData.destination.trim()) {
            newErrors.destination = 'Destination field cannot be empty.';
            valid = false;
        } else if (formData.destination.length > 150) {
            newErrors.destination = 'Destination must be 150 characters or less.';
            valid = false;
        }

        if (!formData.startDate || !formData.endDate) {
            newErrors.dates = 'Both start and end dates are required.';
            valid = false;
        } else if (formData.startDate > formData.endDate) {
            newErrors.dates = 'End date must be after start date.';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            console.log('Submitting:', formData);
        }
    };

    function MapClickHandler({ onLocationSelect }) {
        useMapEvents({
            async click(e) {
                const { lat, lng } = e.latlng;
                const locationName = await reverseGeocode(lat, lng);
                onLocationSelect({
                    coords: [lat, lng],
                    name: locationName
                });
            },
        });
        return null;
    }

    return (
        <div className="trip-creation-container">
            <h1>Create New Trip</h1>

            <form onSubmit={handleSubmit} className="trip-form">
                <div className="form-group">
                    <CustomInput
                        label="Trip Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter trip name"
                        maxLength={100}
                        error={errors.name}
                    />
                    {errors.name && (
                        <p className="error-message">{errors.name}</p>
                    )}
                </div>

                <div className="form-group">
                    <label>
                        Trip Dates *
                    </label>
                    <div className={`date-picker-container ${errors.dates ? 'input-error' : ''}`}>
                        <DatePicker
                            selectsRange
                            startDate={formData.startDate}
                            endDate={formData.endDate}
                            onChange={handleDateChange}
                            isClearable
                            placeholderText="Select start and end date"
                            className="date-picker"
                            minDate={new Date()}
                            dateFormat="MMMM d, yyyy"
                        />
                    </div>
                    {errors.dates && (
                        <p className="error-message">{errors.dates}</p>
                    )}
                </div>

                <div className="form-group">
                    <CustomInput
                        label="Destination *"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="Search or click on the map"
                        maxLength={150}
                        error={errors.destination}
                    />
                    {errors.destination && (
                        <p className="error-message">{errors.destination}</p>
                    )}

                    <div className="map-container">
                        <MapContainer
                            center={[51.505, -0.09]}
                            zoom={13}
                            className="map"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <MapClickHandler
                                onLocationSelect={async ({ coords, name }) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        destination: name,
                                        destinationCoords: coords
                                    }));
                                    if (errors.destination) {
                                        setErrors(prev => ({
                                            ...prev,
                                            destination: ''
                                        }));
                                    }
                                }}
                            />
                            {formData.destinationCoords && (
                                <Marker position={formData.destinationCoords}>
                                    <Popup>{formData.destination}</Popup>
                                </Marker>
                            )}
                        </MapContainer>
                    </div>
                    {isGeocoding && <p className="geocoding-status">Looking up location...</p>}
                </div>



                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={isGeocoding}>
                        {isGeocoding ? 'Processing...' : 'Create Trip'}
                    </button>
                </div>
            </form>
        </div>
    );
}