import {useTripPlannerContext} from "../Contexts/TripPlannerContext.js";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import CustomDateTimePicker from "../../../../Components/DatePicker/CustomDateTimePicker.jsx";

export default function TripPlannerModals() {
    const props = useTripPlannerContext();

    const handleClose = () => {
        props.setShowActivityModal(false);
        props.setError(null);
        props.resetActivityData();
    };

    return (
        <Dialog open={props.showAddActivityModal} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Activity</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField
                        label="Activity title"
                        name="title"
                        placeholder="Enter activity title"
                        fullWidth
                        onChange={props.handleInputChange}
                        error={!!props.formErrors.title}
                        helperText={props.formErrors.title}
                        autoFocus
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

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" color="success" onClick={props.handleSubmit}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}
