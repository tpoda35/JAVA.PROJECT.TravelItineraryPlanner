import {useCallback, useState} from "react";

export function useActivityModals() {
    const [showActivityCreateModal, setShowActivityCreateModal] = useState(false);
    const [showActivityDeleteModal, setShowActivityDeleteModal] = useState(false);

    const [activeTripDay, setActiveTripDay] = useState(null);
    const [activityToDelete, setActivityToDelete] = useState(null);

    const onDeleteActivity = useCallback((activityId) => {
        setActivityToDelete(activityId);
        setShowActivityDeleteModal(true);
    }, []);

    const onAddActivity = useCallback((tripDay) => {
        setActiveTripDay(tripDay);
        setShowActivityCreateModal(true);
    }, []);

    return {
        showActivityCreateModal,
        setShowActivityCreateModal,

        showActivityDeleteModal,
        setShowActivityDeleteModal,

        activeTripDay,
        setActiveTripDay,

        activityToDelete,
        setActivityToDelete,

        onDeleteActivity,
        onAddActivity
    }
}