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
import useTripCreation from "./Hooks/useTripCreation.js";
import {TripCreationContext} from "./Contexts/TripCreationContext.js";

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
    const creation = useTripCreation(folderId);

    return (
        <TripCreationContext.Provider value={creation}>
            <>
                <h1 className="mt0-mr0-mb20-ml0">Create New Trip</h1>

                {(creation.loading || creation.isGeocoding) && <LoadingScreen />}

                <form onSubmit={creation.handleSubmit} className="w-100">
                    <div className="center-full">
                        <CustomInput
                            type="checkbox"
                            label="Enable cooperative planning"
                            onChange={creation.handleCheckboxChange}
                            labelClassName="text-align-center"
                        />
                    </div>

                    <div className="trip-creation-container-group-1">
                        <div>
                            <CustomInput
                                label="Trip Name *"
                                name="name"
                                value={creation.formData.name}
                                onChange={creation.handleInputChange}
                                placeholder="Enter trip name"
                                maxLength={100}
                                error={creation.formErrors.name}
                            />
                        </div>

                        <TripDatePicker
                            label="Trip Date *"
                            startDate={creation.formData.startDate}
                            endDate={creation.formData.endDate}
                            onChange={creation.handleDateChange}
                            error={creation.formErrors.dates}
                        />
                    </div>

                    <div className="trip-creation-container-group-2">
                        <CustomInput
                            label="Destination *"
                            name="destination"
                            value={creation.formData.destination}
                            onChange={creation.handleInputChange}
                            placeholder="Search or click on the map"
                            maxLength={150}
                            error={creation.formErrors.destination}
                            errorClassName="mb-1"
                        />

                        <TripMap center={[51.505, -0.09]} />
                    </div>

                    <div className="center-hor">
                        <CustomButton
                            text="Create Trip"
                            title="Create Trip"
                        />
                    </div>
                </form>
            </>
        </TripCreationContext.Provider>
    );
}