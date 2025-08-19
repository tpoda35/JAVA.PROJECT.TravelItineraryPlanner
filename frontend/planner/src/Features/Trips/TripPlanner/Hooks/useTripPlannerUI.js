import { useState, useCallback } from 'react';
import {initialFormData, initialFormErrors} from "../Utils/TripPlannerUtils.js";

export function useTripPlannerUI() {
    const [showActivityAddModal, setShowActivityAddModal] = useState(false);
    const [showActivityDeleteModal, setShowActivityDeleteModal] = useState(false);
    const [activeTripDay, setActiveTripDay] = useState(null);
    const [activityToDelete, setActivityToDelete] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState(initialFormErrors);

    const resetActivityData = useCallback(() => {
        setFormData(initialFormData);
        setFormErrors(initialFormErrors);
    }, []);

    const onOpenActivityAddModal = useCallback((tripDay) => {
        resetActivityData();
        setActiveTripDay(tripDay);
        setShowActivityAddModal(true);
    }, [resetActivityData]);

    return {
        showActivityAddModal,
        setShowActivityAddModal,
        showActivityDeleteModal,
        setShowActivityDeleteModal,
        activeTripDay,
        formData,
        setFormData,
        formErrors,
        setFormErrors,
        resetActivityData,
        onOpenActivityAddModal,
        activityToDelete,
        setActivityToDelete,
    };
}
