import {useTripData} from './useTripData.js';
import {useTripActivitiesWebSocket} from './useTripActivitiesWebSocket.js';
import useTripNotesWebSocket from "./useTripNotesWebSocket.js";
import {useActivityModals} from "./useActivityModals.js";
import {useNoteModals} from "./useNoteModals.js";

export default function useTripPlanner(tripId) {
    const tripData = useTripData(tripId);
    const activitiesWs = useTripActivitiesWebSocket(tripId, tripData.tripDays, tripData.setTripDays);
    useTripNotesWebSocket(tripId, tripData.setTripNotes);
    const activityModals = useActivityModals();
    const noteModals = useNoteModals();

    // Modal openers
    const onAddActivity = (tripDay) => {
        activityModals.setActiveTripDay(tripDay);
        activityModals.setShowActivityCreateModal(true);
    };

    const onDeleteActivity = (activityId) => {
        activityModals.setActivityToDelete(activityId);
        activityModals.setShowActivityDeleteModal(true);
    }

    return {
        error: tripData.error,
        setError: tripData.setError,

        loading: tripData.loading || activitiesWs.isConnecting,
        setLoading: tripData.setLoading,

        trip: tripData.trip,
        tripId,
        tripDays: tripData.tripDays,

        isConnected: activitiesWs.isConnected,
        isConnecting: activitiesWs.isConnecting,
        sendMessage: activitiesWs.sendMessage,

        showActivityCreateModal: activityModals.showActivityCreateModal,
        setShowActivityCreateModal: activityModals.setShowActivityCreateModal,

        showActivityDeleteModal: activityModals.showActivityDeleteModal,
        setShowActivityDeleteModal: activityModals.setShowActivityDeleteModal,

        activeTripDay: activityModals.activeTripDay,
        setActiveTripDay: activityModals.setActiveTripDay,

        activityToDelete: activityModals.activityToDelete,
        setActivityToDelete: activityModals.setActivityToDelete,

        showNoteDeleteModal: noteModals.showNoteDeleteModal,
        setShowNoteDeleteModal: noteModals.setShowNoteDeleteModal,

        showNoteAddModal: noteModals.showNoteAddModal,
        setShowNoteAddModal: noteModals.setShowNoteAddModal,

        noteToDelete: noteModals.noteToDelete,
        setNoteToDelete: noteModals.setNoteToDelete,

        tripNotes: tripData.tripNotes,
        setTripNotes: tripData.setTripNotes,

        // Modal openers
        onAddActivity,
        onDeleteActivity
    };
}
