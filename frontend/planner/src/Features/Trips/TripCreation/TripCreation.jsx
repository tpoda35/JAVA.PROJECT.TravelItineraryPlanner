import {useParams} from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';

import {Box, Button, Checkbox, FormControlLabel, TextField, Typography,} from '@mui/material';

import TripMap from './Components/TripMap.jsx';
import LoadingScreen from '../../../Components/LoadingScreen/LoadingScreen.jsx';
import useTripCreation from './Hooks/useTripCreation.js';
import {TripCreationContext} from './Contexts/TripCreationContext.js';
import CustomDateTimePicker from '../../../Components/DatePicker/CustomDateTimePicker.jsx';

const DefaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function TripCreation() {
    const { folderId } = useParams();
    const creation = useTripCreation(folderId);

    return (
        <TripCreationContext.Provider value={creation}>
            <Box sx={{ px: 3, py: 4 }}>
                <Typography variant="h4" mb={3}>
                    Create New Trip
                </Typography>

                {(creation.loading || creation.isGeocoding) && <LoadingScreen />}

                <Box
                    component="form"
                    onSubmit={creation.handleSubmit}
                    sx={{ width: '100%' }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={creation.formData.cooperative || false}
                                    onChange={creation.handleCheckboxChange}
                                />
                            }
                            label="Enable cooperative planning"
                            sx={{ '& .MuiFormControlLabel-label': { textAlign: 'center' } }}
                        />
                    </Box>

                    {/* Group 1: Trip Name + Date */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            mb: 3,
                            gap: 2,
                        }}
                    >
                        <Box sx={{ width: '100%' }}>
                            <TextField
                                fullWidth
                                label="Trip Name"
                                name="name"
                                value={creation.formData.name}
                                onChange={creation.handleInputChange}
                                placeholder="Enter trip name"
                                error={!!creation.formErrors.name}
                                helperText={creation.formErrors.name || ' '} // Here we need the '', bc of the place reservation to avoid jumping problems
                            />
                        </Box>

                        <Box sx={{ width: '100%' }}>
                            <CustomDateTimePicker
                                label="Trip Date"
                                startDate={creation.formData.startDate}
                                endDate={creation.formData.endDate}
                                onChange={creation.handleDateChange}
                                error={creation.formErrors.dates}
                                helperText={creation.formErrors.dates || ' '} // Here we need the '', bc of the place reservation to avoid jumping problems
                                selectsRange
                                minDate={new Date()}
                            />
                        </Box>
                    </Box>

                    {/* Group 2: Destination + Map */}
                    <Box>
                        <TextField
                            fullWidth
                            label="Destination"
                            name="destination"
                            value={creation.formData.destination}
                            onChange={creation.handleInputChange}
                            placeholder="Search or click on the map"
                            error={!!creation.formErrors.destination}
                            helperText={creation.formErrors.destination || ' '} // Here we need the '', bc of the place reservation to avoid jumping problems
                            sx={{ mb: 1 }}
                        />
                    </Box>

                    <Box
                        className="map-container"
                        sx={{
                            height: 300,
                            width: '100%',
                            borderRadius: 1,
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider',
                            mb: 4,
                        }}
                    >
                        <TripMap center={[51.505, -0.09]} />
                    </Box>

                    {/* Submit Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" type="submit" color="primary" size="large">
                            Create Trip
                        </Button>
                    </Box>
                </Box>
            </Box>
        </TripCreationContext.Provider>
    );
}