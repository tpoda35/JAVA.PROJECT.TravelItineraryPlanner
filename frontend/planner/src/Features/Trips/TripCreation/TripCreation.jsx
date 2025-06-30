import {useState} from 'react';
import {useParams} from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TripCreation.css';
import './datepicker.css'
import CustomInput from "../../../Components/Input/CustomInput.jsx";
import TripDatePicker from "./Components/TripDatePicker.jsx";
import TripMap from "./Components/TripMap.jsx";
import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen.jsx";
import CustomButton from "../../../Components/Buttons/CustomButton.jsx";
import {reverseGeocode} from "./Utils/Geocoding.js";
import useTripCreation from "./Hooks/useTripCreation.js";

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

export default function TripCreation() {
    const { folderId } = useParams();
    const [isGeocoding, setIsGeocoding] = useState(false);

    const {
        formData,
        errors,
        handleInputChange,
        handleDateChange,
        handleLocationSelect,
        handleCheckboxChange,
        handleSubmit,
        loading
    } = useTripCreation(folderId);

    return (
        <div className="trip-creation-container">
            <h1>Create New Trip</h1>

            {(loading || isGeocoding) && <LoadingScreen />}

            <form onSubmit={handleSubmit}>
                <div className="center-full">
                    <CustomInput
                        type="checkbox"
                        label="Enable cooperative planning"
                        onChange={handleCheckboxChange}
                        labelClassName="text-align-center"
                    />
                </div>

                <div className="trip-creation-container-group-1">
                    <div>
                        <CustomInput
                            label="Trip Name *"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter trip name"
                            maxLength={100}
                            error={errors.name}
                        />
                    </div>

                    <TripDatePicker
                        label="Trip Date *"
                        startDate={formData.startDate}
                        endDate={formData.endDate}
                        onChange={handleDateChange}
                        error={errors.dates}
                    />
                </div>

                <div className="trip-creation-container-group-2">
                    <CustomInput
                        label="Destination *"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="Search or click on the map"
                        maxLength={150}
                        error={errors.destination}
                        errorClassName="mb-1"
                    />

                    <TripMap
                        center={[51.505, -0.09]}
                        onLocationSelect={handleLocationSelect}
                        reverseGeocode={reverseGeocode}
                        destinationCoords={formData.destinationCoords}
                        destination={formData.destination}
                        setIsGeocoding={setIsGeocoding}
                    />
                </div>

                <div className="center-hor">
                    <CustomButton
                        text="Create Trip"
                        title="Create Trip"
                    />
                </div>
            </form>
        </div>
    );
}