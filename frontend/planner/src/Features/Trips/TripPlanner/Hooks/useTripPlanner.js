import {useTripData} from './useTripData.js';
import {useTripActivitiesWebSocket} from './useTripActivitiesWebSocket.js';
import {useTripPlannerUI} from './useTripPlannerUI.js';
import useTripNotesWebSocket from "./useTripNotesWebSocket.js";

export default function useTripPlanner(tripId) {
    const tripData = useTripData(tripId);
    const activitiesWs = useTripActivitiesWebSocket(tripId, tripData.trip, tripData.setTrip);
    useTripNotesWebSocket(tripId, tripData.setTrip);
    const uiState = useTripPlannerUI();

    return {
        error: tripData.error,
        setError: tripData.setError,

        loading: tripData.loading || activitiesWs.isConnecting,
        setLoading: tripData.setLoading,

        trip: tripData.trip,
        tripId,

        isConnected: activitiesWs.isConnected,
        isConnecting: activitiesWs.isConnecting,
        sendMessage: activitiesWs.sendMessage,

        showActivityAddModal: uiState.showActivityAddModal,
        setShowActivityAddModal: uiState.setShowActivityAddModal,

        showActivityDeleteModal: uiState.showActivityDeleteModal,
        setShowActivityDeleteModal: uiState.setShowActivityDeleteModal,

        activeTripDay: uiState.activeTripDay,
        setActiveTripDay: uiState.setActiveTripDay,

        formData: uiState.formData,
        setFormData: uiState.setFormData,

        formErrors: uiState.formErrors,
        setFormErrors: uiState.setFormErrors,

        activityToDelete: uiState.activityToDelete,
        setActivityToDelete: uiState.setActivityToDelete,

        showNoteDeleteModal: uiState.showNoteDeleteModal,
        setShowNoteDeleteModal: uiState.setShowNoteDeleteModal,

        showNoteAddModal: uiState.showNoteAddModal,
        setShowNoteAddModal: uiState.setShowNoteAddModal,

        noteToDelete: uiState.noteToDelete,
        setNoteToDelete: uiState.setNoteToDelete
    };
}
