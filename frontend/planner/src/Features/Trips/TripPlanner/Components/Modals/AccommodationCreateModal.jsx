import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, useTheme} from "@mui/material";
import CustomDateTimePicker from "../../../../../Components/DatePicker/CustomDateTimePicker.jsx";
import {getErrorMessage} from "../../../../../Utils/getErrorMessage.js";
import {showErrorToast} from "../../../../../Utils/Toastify/showErrorToast.js";
import {useCallback, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useTripDataProvider} from "../../Contexts/TripDataContext.jsx";
import {useTripDayForm} from "../../Utils/useTripDayForm.js";
import {useAccommodationModalsProvider} from "../../Contexts/AccommodationModalsContext.jsx";
import {useSharedWebSocket} from "../../../../../Contexts/WebSocketContext.jsx";

const initialFormData = {
    name: "",
    address: "",
    checkIn: null,
    checkOut: null,
    notes: ""
};

const validateAccommodationForm = (data) => {
    const errors = { name: "", address: "", checkIn: "", checkOut: "" };
    if (!data.name.trim()) errors.name = "Name cannot be empty.";
    if (!data.address.trim()) errors.address = "Address cannot be empty.";
    if (!data.checkIn) errors.checkIn = "Check-in cannot be empty.";
    if (!data.checkOut) errors.checkOut = "Check-out cannot be empty.";
    if (data.checkIn && data.checkOut && data.checkIn > data.checkOut) errors.checkIn = "Check-in must be before check-out.";
    return errors;
};

export default function AccommodationCreateModal() {
    const { tripId } = useParams();
    const theme = useTheme();
    const { sendMessage } = useSharedWebSocket();
    const { setLoading, setError } = useTripDataProvider();

    const { activeTripDay, showAccommodationCreateModal, setShowAccommodationCreateModal } = useAccommodationModalsProvider();

    const {
        formData,
        formErrors,
        handleInputChange,
        handleDateChange,
        validateForm,
        resetForm
    } = useTripDayForm(initialFormData, validateAccommodationForm);

    useEffect(() => {
        if (activeTripDay) {
            const checkInDate = new Date(activeTripDay.date);

            // clone checkInDate and add 1 day for checkOut
            const checkOutDate = new Date(checkInDate);
            checkOutDate.setDate(checkOutDate.getDate() + 1);

            handleDateChange("checkIn", checkInDate);
            handleDateChange("checkOut", checkOutDate);
        }
    }, [activeTripDay, handleDateChange]);


    const handleClose = useCallback(() => {
        setShowAccommodationCreateModal(false);
        resetForm();
    }, [setShowAccommodationCreateModal, resetForm]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!activeTripDay) return;

        const errors = validateForm();
        if (Object.values(errors).some(Boolean)) return;

        const payload = {
            type: "ACCOMMODATION_CREATED",
            accommodation: {
                name: formData.name,
                address: formData.address,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut,
                notes: formData.notes
            }
        };

        setLoading(true);
        try {
            sendMessage(`/app/trips/${tripId}/days/${activeTripDay.id}`, JSON.stringify(payload));
            handleClose();
        } catch (err) {
            const msg = getErrorMessage(err, "Failed to create accommodation.");
            setError(msg);
            showErrorToast(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={showAccommodationCreateModal} onClose={handleClose} fullWidth disableScrollLock>
            <DialogTitle sx={{ display: "flex", justifyContent: "center", fontWeight: 600, fontSize: "1.25rem", borderBottom: `1px solid ${theme.palette.divider}` }}>
                Create Accommodation
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
                        label="Address"
                        name="address"
                        fullWidth
                        value={formData.address}
                        onChange={handleInputChange}
                        error={!!formErrors.address}
                        helperText={formErrors.address || " "}
                    />
                    <CustomDateTimePicker
                        label="Check-in"
                        startDate={formData.checkIn}
                        onChange={(date) => handleDateChange("checkIn", date)}
                        error={formErrors.checkIn}
                        showTimeSelect
                        timeIntervals={30}
                        timeFormat="HH:mm"
                        dateFormat="yyyy.MM.dd HH:mm"
                        bgColor={theme.palette.background.paper}
                    />
                    <CustomDateTimePicker
                        label="Check-out"
                        startDate={formData.checkOut}
                        onChange={(date) => handleDateChange("checkOut", date)}
                        error={formErrors.checkOut}
                        showTimeSelect
                        timeIntervals={30}
                        timeFormat="HH:mm"
                        dateFormat="yyyy.MM.dd HH:mm"
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
                <Button onClick={handleClose} color="inherit">Cancel</Button>
                <Button variant="contained" color="success" onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}
