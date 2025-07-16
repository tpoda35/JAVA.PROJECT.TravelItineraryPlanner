import {useTripPlannerContext} from "../Contexts/TripPlannerContext.js";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, useTheme} from "@mui/material";
import CustomDateTimePicker from "../../../../Components/DatePicker/CustomDateTimePicker.jsx";

export default function TripPlannerModals() {
    const props = useTripPlannerContext();
    const theme = useTheme();

    const handleClose = () => {
        props.setShowActivityModal(false);
        props.setError(null);
        props.resetActivityData();
    };

    return (
        <Dialog
            open={props.showAddActivityModal}
            onClose={handleClose}
            fullWidth
            disableScrollLock
        >
            <DialogTitle
                sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    fontSize: '1.25rem',
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}
            >
                Add Activity
            </DialogTitle>

            <DialogContent
                sx={{
                    overflow: 'hidden',
                    paddingTop: 2,
                    paddingBottom: 2
                }}
            >
                <Stack spacing={2} sx={{marginTop: 2}}>
                    <TextField
                        label="Activity title"
                        name="title"
                        placeholder="Enter activity title"
                        fullWidth
                        onChange={props.handleInputChange}
                        error={!!props.formErrors.title}
                        helperText={props.formErrors.title || ' '}
                        autoFocus
                        color="primary"
                    />

                    <CustomDateTimePicker
                        label="Start Time"
                        startDate={props.formData.startDate}
                        onChange={(time) =>
                            props.handleTimeChange([time, props.formData.endDate])
                        }
                        error={props.formErrors.startTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={5}
                    />

                    <CustomDateTimePicker
                        label="End Time"
                        startDate={props.formData.endDate}
                        onChange={(time) =>
                            props.handleTimeChange([props.formData.startDate, time])
                        }
                        error={props.formErrors.endTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={5}
                    />
                </Stack>
            </DialogContent>

            <DialogActions
                sx={{
                    padding: '8px 24px',
                }}
            >
                <Button onClick={handleClose} color="inherit">Cancel</Button>
                <Button variant="contained" color="success" onClick={props.handleSubmit}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}
