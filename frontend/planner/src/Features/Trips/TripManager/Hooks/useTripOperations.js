import { useApi } from "../../../../Hooks/useApi.js";
import { getErrorMessage } from "../../../../Utils/getErrorMessage.js";
import { showErrorToast } from "../../../../Utils/Toastify/showErrorToast.js";

export function useTripOperations() {
    const api = useApi();

    const handleRenameTrip = async (tripToRename, newTripName, setFormError, setError, setShowTripRenameModal, setFolders, folderId) => {
        if (!newTripName.trim()) return setFormError("Trip name cannot be empty.");
        try {
            await api.patch(`/trips/rename/${tripToRename}?newTripName=${encodeURIComponent(newTripName.trim())}`);

            setFolders((prevFolders) =>
                prevFolders.map((folder) =>
                    folder.id === folderId
                        ? {
                            ...folder,
                            trips: folder.trips.map((trip) =>
                                trip.id === tripToRename ? { ...trip, name: newTripName.trim() } : trip
                            )
                        }
                        : folder
                )
            );

            setShowTripRenameModal(false);
        } catch (err) {
            const errorMsg = getErrorMessage(err, 'Failed to rename trip.');
            setError(errorMsg);
            showErrorToast(errorMsg);
        }
    };

    const handleDeleteTrip = async (tripToDelete, setError, setShowTripDeleteModal, loadFolders) => {
        try {
            await api.delete(`/trips/${tripToDelete}`);
            setShowTripDeleteModal(false);
            await loadFolders();
        } catch (err) {
            const errorMsg = getErrorMessage(err, 'Failed to delete trip.');
            setError(errorMsg);
            showErrorToast(errorMsg);
        }
    };

    return {
        handleRenameTrip,
        handleDeleteTrip
    };
}