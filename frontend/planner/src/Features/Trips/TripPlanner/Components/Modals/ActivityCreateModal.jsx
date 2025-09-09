import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, useTheme } from "@mui/material";
import CustomDateTimePicker from "../../../../../Components/DatePicker/CustomDateTimePicker.jsx";
import { getErrorMessage } from "../../../../../Utils/getErrorMessage.js";
import { showErrorToast } from "../../../../../Utils/Toastify/showErrorToast.js";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTripDataProvider } from "../../Contexts/TripDataContext.jsx";
import { useActivityModalsProvider } from "../../Contexts/ActivityModalsContext.jsx";
import { useSharedWebSocket } from "../../../../../Contexts/WebSocketContext.jsx";
import {useTripDayForm} from "../../Utils/useTripDayForm.js";

const initialFormData = {
    title: "",
    description: "",
    startDate: null,
    endDate: null
};

const validateActivityForm = (data) => {
    const errors = { title: "", startTime: "", endTime: "" };

    if (!data.title.trim()) errors.title = "Title cannot be empty.";
    else if (data.title.length > 100) errors.title = "Title must be 100 characters or less.";

    if (!data.startDate) errors.startTime = "Start time cannot be empty.";
    if (!data.endDate) errors.endTime = "End time cannot be empty.";

    if (data.startDate && data.endDate && data.startDate > data.endDate) {
        errors.startTime = "Start time must be before end time.";
    }

    return errors;
};

export default function ActivityCreateModal() {
    const { tripId } = useParams();
    const theme = useTheme();
    const { sendMessage } = useSharedWebSocket();
    const { setLoading, setError } = useTripDataProvider();

    const { activeTripDay, showActivityCreateModal, setShowActivityCreateModal } = useActivityModalsProvider();

    const {
        formData,
        formErrors,
        handleInputChange,
        handleDateChange,
        validateForm,
        resetForm
    } = useTripDayForm(initialFormData, validateActivityForm);

    const handleClose = useCallback(() => {
        setShowActivityCreateModal(false);
        resetForm();
    }, [setShowActivityCreateModal, resetForm]);

    const handleTimeChange = (start, end) => {
        if (!activeTripDay?.date) return;
        const applyFixedDate = (time) => {
            if (!time) return null;
            const fixed = new Date(activeTripDay.date);
            fixed.setHours(time.getHours(), time.getMinutes(), 0, 0);
            return fixed;
        };
        handleDateChange("startDate", applyFixedDate(start));
        handleDateChange("endDate", applyFixedDate(end));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!activeTripDay) return;

        const errors = validateForm();
        if (Object.values(errors).some(Boolean)) return;

        const payload = {
            type: "ACTIVITY_CREATED",
            activity: {
                title: formData.title,
                description: formData.description,
                startDate: formData.startDate,
                endDate: formData.endDate
            }
        };

        setLoading(true);
        try {
            sendMessage(`/app/trips/${tripId}/days/${activeTripDay.id}`, JSON.stringify(payload));
            handleClose();
        } catch (err) {
            const msg = getErrorMessage(err, "Failed to create activity.");
            setError(msg);
            showErrorToast(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={showActivityCreateModal} onClose={handleClose} fullWidth disableScrollLock>
            <DialogTitle sx={{ display: "flex", justifyContent: "center", fontWeight: 600, fontSize: "1.25rem", borderBottom: `1px solid ${theme.palette.divider}` }}>
                Create Activity
            </DialogTitle>
            <DialogContent sx={{ overflow: "hidden", pt: 2, pb: 2 }}>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    <TextField label="Title" name="title" fullWidth value={formData.title} onChange={handleInputChange} error={!!formErrors.title} helperText={formErrors.title || " "} autoFocus />
                    <TextField label="Description" name="description" fullWidth value={formData.description} onChange={handleInputChange} helperText=" " />
                    <CustomDateTimePicker label="Start Time" startDate={formData.startDate} onChange={(time) => handleTimeChange(time, formData.endDate)} error={formErrors.startTime} showTimeSelect showTimeSelectOnly timeIntervals={5} bgColor={theme.palette.background.paper} />
                    <CustomDateTimePicker label="End Time" startDate={formData.endDate} onChange={(time) => handleTimeChange(formData.startDate, time)} error={formErrors.endTime} showTimeSelect showTimeSelectOnly timeIntervals={5} bgColor={theme.palette.background.paper} />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: "8px 24px" }}>
                <Button onClick={handleClose} color="inherit">Cancel</Button>
                <Button variant="contained" color="success" onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}
