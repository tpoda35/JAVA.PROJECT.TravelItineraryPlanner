import { useApi } from "../../../../Hooks/useApi.js";
import { getErrorMessage } from "../../../../Utils/getErrorMessage.js";

export function useTripOperations() {
    const api = useApi();

    const handleRenameTrip = async (tripToRename, newTripName, setFormError, setShowTripRenameModal, setFolders, folderId) => {
        if (!newTripName.trim()) {
            setFormError("Trip name cannot be empty.");
            return false;
        }

        try {
            await api.patch(`/trips/rename/${tripToRename}?newTripName=${encodeURIComponent(newTripName.trim())}`);

            setFolders(prevFolders =>
                prevFolders.map(folder =>
                    folder.id === folderId
                        ? {
                            ...folder,
                            trips: folder.trips.map(trip =>
                                trip.id === tripToRename
                                    ? { ...trip, name: newTripName.trim() }
                                    : trip
                            )
                        }
                        : folder
                )
            );

            setShowTripRenameModal(false);
            return true;
        } catch (err) {
            setFormError(getErrorMessage(err, 'Failed to rename trip.'));
            return false;
        }
    };

    const handleDeleteTrip = async (tripToDelete, setFormError, setShowTripDeleteModal, folders, setFolders, folderId) => {
        try {
            await api.delete(`/trips/${tripToDelete}`);

            setFolders(prevFolders =>
                prevFolders.map(folder =>
                    folder.id === folderId
                        ? {
                            ...folder,
                            trips: folder.trips.filter(trip => trip.id !== tripToDelete)
                        }
                        : folder
                )
            );

            setShowTripDeleteModal(false);
            return true;
        } catch (err) {
            setFormError(getErrorMessage(err, 'Failed to delete trip.'));
            return false;
        }
    };

    return {
        handleRenameTrip,
        handleDeleteTrip
    };
}
