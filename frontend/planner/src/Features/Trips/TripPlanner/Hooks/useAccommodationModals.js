import { useCallback, useState } from "react";

export function useAccommodationModals() {
    const [showAccommodationCreateModal, setShowAccommodationCreateModal] = useState(false);
    const [showAccommodationDeleteModal, setShowAccommodationDeleteModal] = useState(false);

    const [activeTripDayId, setActiveTripDayId] = useState(null);
    const [activeTripDay, setActiveTripDay] = useState(null);
    const [accommodationToDelete, setAccommodationToDelete] = useState(null);

    const onDeleteAccommodation = useCallback((accommodationId, tripDayId) => {
        setAccommodationToDelete(accommodationId);
        setActiveTripDayId(tripDayId);
        setShowAccommodationDeleteModal(true);
    }, []);

    const onAddAccommodation = useCallback((tripDay) => {
        setActiveTripDay(tripDay);
        setShowAccommodationCreateModal(true);
    }, []);

    return {
        // Create modal
        showAccommodationCreateModal,
        setShowAccommodationCreateModal,

        // Delete modal
        showAccommodationDeleteModal,
        setShowAccommodationDeleteModal,

        // Context data
        activeTripDay,
        setActiveTripDay,

        activeTripDayId,
        setActiveTripDayId,

        accommodationToDelete,
        setAccommodationToDelete,

        // Handlers
        onDeleteAccommodation,
        onAddAccommodation,
    };
}
