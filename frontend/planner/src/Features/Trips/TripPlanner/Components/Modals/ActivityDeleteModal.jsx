import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {useCallback} from "react";
import {useActivityModalsProvider} from "../../Contexts/ActivityModalsContext.jsx";
import {useParams} from "react-router-dom";
import {useSharedWebSocket} from "../../../../../Contexts/WebSocketContext.jsx";

export default function ActivityDeleteModal({ dayId }) {
    const { tripId } = useParams();
    const { sendMessage } = useSharedWebSocket();

    const {
        showActivityDeleteModal,
        setShowActivityDeleteModal,
        activityToDelete
    } = useActivityModalsProvider();

    const handleDeleteActivity = useCallback(() => {
        const payload = {
            type: "ACTIVITY_DELETED",
            entityId: activityToDelete
        };

        sendMessage(
            `/app/trips/${tripId}/days/${dayId}`,
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