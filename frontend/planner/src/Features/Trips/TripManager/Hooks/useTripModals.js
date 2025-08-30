import { useState } from "react";

export function useTripModals() {
    const [showTripRenameModal, setShowTripRenameModal] = useState(false);
    const [showTripDeleteModal, setShowTripDeleteModal] = useState(false);

    const [tripToRename, setTripToRename] = useState(null);
    const [tripToDelete, setTripToDelete] = useState(null);
    const [newTripName, setNewTripName] = useState("");

    const [activeFolderId, setActiveFolderId] = useState(null);

    const onRenameTrip = (tripId, name, folderId) => {
        setTripToRename(tripId);
        setNewTripName(name);
        setActiveFolderId(folderId);
        setShowTripRenameModal(true);
    };

    const onDeleteTrip = (tripId, folderId) => {
        setTripToDelete(tripId);
        setActiveFolderId(folderId);
        setShowTripDeleteModal(true);
    };

    return {
        // Modal visibility states
        showTripRenameModal,
        showTripDeleteModal,

        // Modal visibility setters
        setShowTripRenameModal,
        setShowTripDeleteModal,

        // Trip operations state
        tripToRename,
        tripToDelete,
        newTripName,
        activeFolderId,

        // Trip operations setters
        setTripToRename,
        setTripToDelete,
        setNewTripName,
        setActiveFolderId,

        // Handlers
        onRenameTrip,
        onDeleteTrip
    };
}