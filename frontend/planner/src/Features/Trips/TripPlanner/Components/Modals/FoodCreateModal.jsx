import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
    useTheme,
} from "@mui/material";
import CustomDateTimePicker from "../../../../../Components/DatePicker/CustomDateTimePicker.jsx";
import {getErrorMessage} from "../../../../../Utils/getErrorMessage.js";
import {showErrorToast} from "../../../../../Utils/Toastify/showErrorToast.js";
import {useCallback} from "react";
import {useParams} from "react-router-dom";
import {useTripDataProvider} from "../../Contexts/TripDataContext.jsx";
import {useTripDayForm} from "../../Utils/useTripDayForm.js";
import {handleTimeChangeFactory} from "../../Utils/handleTimeChangeFactory.js";
import {useFoodModalsProvider} from "../../Contexts/FoodModalsContext.jsx";
import {useSharedWebSocket} from "../../../../../Contexts/WebSocketContext.jsx";

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

const initialFormData = {
    name: "",
    location: "",
    mealType: "",
    startDate: null,
    endDate: null,
    notes: "",
};

const validateFoodForm = (data) => {
    const errors = {
        name: "",
        location: "",
        mealType: "",
        startDate: "",
        endDate: "",
    };

    if (!data.name.trim()) errors.name = "Name cannot be empty.";
    if (!data.location.trim()) errors.location = "Location cannot be empty.";
    if (!data.mealType) errors.mealType = "Please select a meal type.";
    if (!data.startDate) errors.startDate = "Start time cannot be empty.";
    if (!data.endDate) errors.endDate = "End time cannot be empty.";
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
        errors.startDate = "Start time must be before end time.";
    }

    return errors;
};

export default function FoodCreateModal() {
    const { tripId } = useParams();
    const theme = useTheme();
    const { sendMessage } = useSharedWebSocket();
    const { setLoading, setError } = useTripDataProvider();

    const { activeTripDay, showFoodCreateModal, setShowFoodCreateModal } =
        useFoodModalsProvider();

    const {
        formData,
        formErrors,
        handleInputChange,
        handleDateChange,
        validateForm,
        resetForm,
    } = useTripDayForm(initialFormData, validateFoodForm);

    const handleClose = useCallback(() => {
        setShowFoodCreateModal(false);
        resetForm();
    }, [setShowFoodCreateModal, resetForm]);

    const handleTimeChange = handleTimeChangeFactory(activeTripDay, handleDateChange);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!activeTripDay) return;

        const errors = validateForm();
        if (Object.values(errors).some(Boolean)) return;

        const payload = {
            type: "FOOD_CREATED",
            food: {
                name: formData.name,
                location: formData.location,
                mealType: formData.mealType,
                startDate: formData.startDate,
                endDate: formData.endDate,
                notes: formData.notes || null,
            },
        };

        setLoading(true);
        try {
            sendMessage(`/app/trips/${tripId}/days/${activeTripDay.id}`, JSON.stringify(payload));
            handleClose();
        } catch (err) {
            const msg = getErrorMessage(err, "Failed to create food.");
            setError(msg);
            showErrorToast(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={showFoodCreateModal}
            onClose={handleClose}
            fullWidth
            disableScrollLock
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: "1.25rem",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                Create Food
            </DialogTitle>

            <DialogContent sx={{ overflow: "hidden", pt: 2, pb: 2 }}>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <TextField
                        label="Name"
                        name="name"
                        fullWidth
                        value={formData.name}
                        onChange={handleInputChange}
                        error={!!formErrors.name}
                        helperText={formErrors.name || " "}
                        autoFocus
                    />

                    <TextField
                        label="Location"
                        name="location"
                        fullWidth
                        value={formData.location}
                        onChange={handleInputChange}
                        error={!!formErrors.location}
                        helperText={formErrors.location || " "}
                    />

                    <TextField
                        select
                        label="Meal Type"
                        name="mealType"
                        fullWidth
                        value={formData.mealType}
                        onChange={handleInputChange}
                        error={!!formErrors.mealType}
                        helperText={formErrors.mealType || " "}
                    >
                        {MEAL_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type.charAt(0) + type.slice(1).toLowerCase()}
                            </MenuItem>
                        ))}
                    </TextField>

                    <CustomDateTimePicker
                        label="Start Time"
                        startDate={formData.startDate}
                        onChange={(time) => handleTimeChange(time, formData.endDate)}
                        error={formErrors.startDate}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        bgColor={theme.palette.background.paper}
                    />

                    <CustomDateTimePicker
                        label="End Time"
                        startDate={formData.endDate}
                        onChange={(time) => handleTimeChange(formData.startDate, time)}
                        error={formErrors.endDate}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        bgColor={theme.palette.background.paper}
                    />

                    <TextField
                        label="Notes (optional)"
                        name="notes"
                        fullWidth
                        multiline
                        minRows={2}
                        value={formData.notes}
                        onChange={handleInputChange}
                        helperText=" "
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: "8px 24px" }}>
                <Button onClick={handleClose} color="inherit">
                    Cancel
                </Button>
                <Button variant="contained" color="success" onClick={handleSubmit}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}
