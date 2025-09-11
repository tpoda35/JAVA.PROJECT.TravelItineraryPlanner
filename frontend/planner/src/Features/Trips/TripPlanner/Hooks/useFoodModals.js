import { useCallback, useState } from "react";

export function useFoodModals() {
    const [showFoodCreateModal, setShowFoodCreateModal] = useState(false);
    const [showFoodDeleteModal, setShowFoodDeleteModal] = useState(false);

    const [activeTripDayId, setActiveTripDayId] = useState(null);
    const [activeTripDay, setActiveTripDay] = useState(null);
    const [foodToDelete, setFoodToDelete] = useState(null);

    const onDeleteFood = useCallback((foodId, tripDayId) => {
        setFoodToDelete(foodId);
        setActiveTripDayId(tripDayId);
        setShowFoodDeleteModal(true);
    }, []);

    const onAddFood = useCallback((tripDay) => {
        setActiveTripDay(tripDay);
        setShowFoodCreateModal(true);
    }, []);

    return {
        // Create modal
        showFoodCreateModal,
        setShowFoodCreateModal,

        // Delete modal
        showFoodDeleteModal,
        setShowFoodDeleteModal,

        // Context data
        activeTripDay,
        setActiveTripDay,

        activeTripDayId,
        setActiveTripDayId,

        foodToDelete,
        setFoodToDelete,

        // Handlers
        onDeleteFood,
        onAddFood,
    };
}
