import {useTripManagerContext} from "../../Contexts/TripManagerContext.js";
import ConfirmModal from "../../../../../Components/Modal/ConfirmModal.jsx";

export default function TripDeleteModal() {
    const {
        handleDeleteTrip,
        showTripDeleteModal,
        setShowTripDeleteModal
    } = useTripManagerContext();

    const handleClose = () => {
        setShowTripDeleteModal(false);
    };

    return (
        <ConfirmModal
            open={showTripDeleteModal}
            title="Delete Trip"
            content="Are you sure?"
            onCancel={handleClose}
            onConfirm={handleDeleteTrip}
            confirmText="Delete"
            confirmColor="error"
        />
    );
}
