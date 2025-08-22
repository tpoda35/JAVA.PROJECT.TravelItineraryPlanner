import {useState} from 'react';
import {initialFormData, initialFormErrors} from "../Utils/TripPlannerUtils.js";

export function useTripPlannerUI() {
    const [showActivityAddModal, setShowActivityAddModal] = useState(false);
    const [showActivityDeleteModal, setShowActivityDeleteModal] = useState(false);

    const [showNoteDeleteModal, setShowNoteDeleteModal] = useState(false);
    const [showNoteAddModal, setShowNoteAddModal] = useState(false);

    const [activeTripDay, setActiveTripDay] = useState(null);

    const [activityToDelete, setActivityToDelete] = useState(null);
    const [noteToDelete, setNoteToDelete] = useState(null);

    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState(initialFormErrors);

    return {
        showActivityAddModal,
        setShowActivityAddModal,

        showActivityDeleteModal,
        setShowActivityDeleteModal,

        activeTripDay,
        setActiveTripDay,

        formData,
        setFormData,
        formErrors,
        setFormErrors,

        activityToDelete,
        setActivityToDelete,

        showNoteDeleteModal,
        setShowNoteDeleteModal,

        showNoteAddModal,
        setShowNoteAddModal,

        noteToDelete,
        setNoteToDelete
    };
}
