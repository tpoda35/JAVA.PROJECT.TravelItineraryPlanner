import {useState} from "react";

export function useActivityModals() {
    const [showActivityAddModal, setShowActivityAddModal] = useState(false);
    const [showActivityDeleteModal, setShowActivityDeleteModal] = useState(false);

    const [activeTripDay, setActiveTripDay] = useState(null);
    const [activityToDelete, setActivityToDelete] = useState(null);

    return {
        showActivityAddModal,
        setShowActivityAddModal,

        showActivityDeleteModal,
        setShowActivityDeleteModal,

        activeTripDay,
        setActiveTripDay,

        activityToDelete,
        setActivityToDelete,
    }
}