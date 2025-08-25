import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {useTripPlannerContext} from "../../Contexts/TripPlannerContext.js";
import {useCallback} from "react";

export default function ActivityDeleteModal({ dayId }) {
    const {
        showActivityDeleteModal,
        setShowActivityDeleteModal,
        sendMessage,
        tripId,
        activityToDelete
    } = useTripPlannerContext();

    const handleDeleteActivity = useCallback(() => {
        const payload = {
            type: "ACTIVITY_DELETED",
            activityId: activityToDelete
        };

        sendMessage(
            `/app/trips/${tripId}/days/${dayId}/activities`,
            JSON.stringify(payload)
        );
        setShowActivityDeleteModal(false);
    }, [dayId, tripId, sendMessage, activityToDelete]);

    const handleClose = () => {
        setShowActivityDeleteModal(false);
    };

    return (
        <Dialog
            open={showActivityDeleteModal}
            onClose={handleClose}
            disableScrollLock
        >
            <DialogTitle>Delete Trip</DialogTitle>
            <DialogContent>
                <Typography>Are you sure?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDeleteActivity} color="error" variant="contained">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}