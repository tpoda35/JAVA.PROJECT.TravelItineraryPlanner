import {useTripPlannerContext} from "../../Contexts/TripPlannerContext.js";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, useTheme} from "@mui/material";
import CustomDateTimePicker from "../../../../../Components/DatePicker/CustomDateTimePicker.jsx";
import {getErrorMessage} from "../../../../../Utils/getErrorMessage.js";
import {showErrorToast} from "../../../../../Utils/Toastify/showErrorToast.js";
import {useCallback, useState} from "react";
import {initialFormData, initialFormErrors} from "../../Utils/TripPlannerUtils.js";

export default function ActivityCreateModal({ tripId }) {
    const {
        setError,
        setLoading,
        sendMessage,
        showActivityCreateModal,
        setShowActivityCreateModal,
        activeTripDay
    } = useTripPlannerContext();
    const theme = useTheme();

    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState(initialFormErrors);

    const resetActivityData = useCallback(() => {
        setFormData(initialFormData);
        setFormErrors(initialFormErrors);
    }, []);

    const handleClose = () => {
        setShowActivityCreateModal(false);
        resetActivityData();
    };

    const handleTimeChange = ([start, end]) => {
        if (!activeTripDay?.date) return;

        const applyFixedDate = (time) => {
            if (!time) return null;
            const fixed = new Date(activeTripDay.date);
            fixed.setHours(time.getHours(), time.getMinutes(), 0, 0);
            return fixed;
        };

        setFormData(prev => ({
            ...prev,
            startDate: applyFixedDate(start),
            endDate: applyFixedDate(end),
        }));

        clearFormError('startTime', start);
        clearFormError('endTime', end);
    };

    const clearFormError = (fieldName, value) => {
        if (value && formErrors[fieldName]) {
            setFormErrors(prev => ({
                ...prev,
                [fieldName]: ''
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        clearFormError(name, value);
    };

    const validateForm = () => {
        const errors = {
            title: '',
            startTime: '',
            endTime: ''
        };

        if (!formData.title.trim()) {
            errors.title = 'Title field cannot be empty.';
        } else if (formData.title.length > 100) {
            errors.title = 'Title must be 100 characters or less.';
        }

        if (!formData.startDate) {
            errors.startTime = 'Start time cannot be empty.';
        }

        if (!formData.endDate) {
            errors.endTime = 'End time cannot be empty.';
        }

        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            errors.startTime = 'Start time must be before end time.';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitErrors = validateForm();
        setFormErrors(submitErrors);

        if (Object.values(submitErrors).some(error => !!error) || !activeTripDay) return;

        const payload = {
            type: 'ACTIVITY_CREATED',
            activityDetailsDtoV3: {
                title: formData.title,
                description: formData.description,
                startDate: formData.startDate,
                endDate: formData.endDate
            }
        };

        setLoading(true);
        try {
            sendMessage(
                `/app/trips/${tripId}/days/${activeTripDay.id}/activities`,
                JSON.stringify(payload)
            );

            handleClose();
        } catch (err) {
            const errorMsg = getErrorMessage(err, 'Failed to create activity.');
            setError(errorMsg);
            showErrorToast(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={showActivityCreateModal}
            onClose={handleClose}
            fullWidth
            disableScrollLock
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '1.25rem',
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}
            >
                Create activity
            </DialogTitle>

            <DialogContent
                sx={{
                    overflow: 'hidden',
                    paddingTop: 2,
                    paddingBottom: 2
                }}
            >
                <Stack spacing={2} sx={{ marginTop: 2 }}>
                    <TextField
                        label="Title"
                        name="title"
                        placeholder="Enter activity title"
                        fullWidth
                        onChange={handleInputChange}
                        error={!!formErrors.title}
                        helperText={formErrors.title || ' '}
                        autoFocus
                        color="primary"
                    />

                    <TextField
                        label="Description"
                        name="description"
                        placeholder="Enter description"
                        fullWidth
                        onChange={handleInputChange}
                        helperText=' '
                        color="primary"
                    />

                    <CustomDateTimePicker
                        label="Start Time"
                        startDate={formData.startDate}
                        onChange={(time) => handleTimeChange([time, formData.endDate])}
                        error={formErrors.startTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={5}
                        bgColor={theme.palette.background.paper}
                    />

                    <CustomDateTimePicker
                        label="End Time"
                        startDate={formData.endDate}
                        onChange={(time) => handleTimeChange([formData.startDate, time])}
                        error={formErrors.endTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={5}
                        bgColor={theme.palette.background.paper}
                    />
                </Stack>
            </DialogContent>

            <DialogActions
                sx={{
                    padding: '8px 24px',
                }}
            >
                <Button onClick={handleClose} color="inherit">Cancel</Button>
                <Button variant="contained" color="success" onClick={handleSubmit}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}
