import {useCallback, useState} from "react";

export function useActivityModals() {
    const [showActivityCreateModal, setShowActivityCreateModal] = useState(false);
    const [showActivityDeleteModal, setShowActivityDeleteModal] = useState(false);

    const [activeTripDayId, setActiveTripDayId] = useState(null);
    const [activeTripDay, setActiveTripDay] = useState(null);
    const [activityToDelete, setActivityToDelete] = useState(null);

    const onDeleteActivity = useCallback((activityId, tripDayId) => {
        setActivityToDelete(activityId);
        setActiveTripDayId(tripDayId);
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

        activeTripDayId,
        setActiveTripDayId,

        activityToDelete,
        setActivityToDelete,

        onDeleteActivity,
        onAddActivity
    }
}