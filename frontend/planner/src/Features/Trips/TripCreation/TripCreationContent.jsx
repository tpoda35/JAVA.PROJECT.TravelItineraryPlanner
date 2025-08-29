import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen.jsx";
import CustomDateTimePicker from "../../../Components/DatePicker/CustomDateTimePicker.jsx";
import TripMap from "./Components/TripMap.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../../Hooks/useApi.js";
import { useCallback, useMemo, useState } from "react";
import { getErrorMessage } from "../../../Utils/getErrorMessage.js";
import { showErrorToast } from "../../../Utils/Toastify/showErrorToast.js";
import { useTripCreationProvider } from "./Contexts/TripCreationContext.jsx";

export default function TripCreationContent() {
    const { folderId } = useParams();
    const theme = useTheme();
    const navigate = useNavigate();
    const { post } = useApi();
    const tripCreation = useTripCreationProvider();

    const [name, setName] = useState("");
    const [destination, setDestination] = useState("");
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [formErrors, setFormErrors] = useState({
        name: "",
        destination: "",
        dates: "",
    });

    const handleInputChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            if (name === "name") {
                setName(value);
                if (formErrors.name) {
                    setFormErrors((prev) => ({ ...prev, name: "" }));
                }
            }
            if (name === "destination") {
                setDestination(value);
                if (formErrors.destination) {
                    setFormErrors((prev) => ({ ...prev, destination: "" }));
                }
            }
        },
        [formErrors]
    );

    const handleDateChange = useCallback(
        (dates) => {
            const [start, end] = dates;
            setStartDate(start);
            setEndDate(end);

            if (formErrors.dates) {
                setFormErrors((prev) => ({ ...prev, dates: "" }));
            }
        },
        [formErrors]
    );

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            let valid = true;
            const submitErrors = { name: "", destination: "", dates: "" };

            if (!name.trim()) {
                submitErrors.name = "Name field cannot be empty.";
                valid = false;
            } else if (name.length > 100) {
                submitErrors.name = "Name must be 100 characters or less.";
                valid = false;
            }

            if (!destination.trim()) {
                submitErrors.destination = "Destination field cannot be empty.";
                valid = false;
            } else if (destination.length > 150) {
                submitErrors.destination =
                    "Destination must be 150 characters or less.";
                valid = false;
            }

            if (!startDate || !endDate) {
                submitErrors.dates = "Both start and end dates are required.";
                valid = false;
            } else if (startDate > endDate) {
                submitErrors.dates = "End date must be after start date.";
                valid = false;
            }

            setFormErrors(submitErrors);

            if (!valid) return;

            const payload = {
                name,
                destination,
                startDate,
                endDate,
                folderId: Number(folderId),
            };

            tripCreation.setLoading(true);
            try {
                await post("/trips", payload);
                navigate("/trip-manager");
            } catch (err) {
                const errorMsg = getErrorMessage(err, "Failed to create trip.");
                tripCreation.setError(errorMsg);
                showErrorToast(errorMsg);
            } finally {
                tripCreation.setLoading(false);
            }
        },
        [name, destination, startDate, endDate, folderId, post, navigate, tripCreation]
    );

    const mapProps = useMemo(
        () => ({
            destination,
            setDestination,
            destinationCoords,
            setDestinationCoords,
            formErrors,
            setFormErrors,
        }),
        [destination, destinationCoords, formErrors]
    );

    return (
        <Box sx={{ px: 3, py: 4 }}>
            {tripCreation.loading && <LoadingScreen transparent />}

            <Typography variant="h4" mb={3}>
                Create New Trip
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
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
                            value={name}
                            onChange={handleInputChange}
                            placeholder="Enter trip name"
                            error={!!formErrors.name}
                            helperText={formErrors.name || ' '} // Here we need the '', bc of the place reservation to avoid jumping problems
                        />
                    </Box>

                    <Box sx={{ width: '100%' }}>
                        <CustomDateTimePicker
                            label="Trip Date"
                            startDate={startDate}
                            endDate={endDate}
                            onChange={handleDateChange}
                            error={formErrors.dates}
                            helperText={formErrors.dates || ' '} // Here we need the '', bc of the place reservation to avoid jumping problems
                            selectsRange
                            minDate={new Date()}
                            bgColor={theme.palette.background.default}
                        />
                    </Box>
                </Box>

                {/* Group 2: Destination + Map */}
                <TextField
                    fullWidth
                    label="Destination"
                    name="destination"
                    value={destination}
                    onChange={handleInputChange}
                    placeholder="Search or click on the map"
                    error={!!formErrors.destination}
                    helperText={formErrors.destination || " "}
                    sx={{ mb: 1 }}
                />

                <Box
                    className="map-container"
                    sx={{
                        height: 300,
                        width: "100%",
                        borderRadius: 1,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        mb: 4,
                    }}
                >
                    <TripMap {...mapProps} />
                </Box>

                {/* Submit Button */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        size="large"
                    >
                        Create Trip
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
