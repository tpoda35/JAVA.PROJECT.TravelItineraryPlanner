import { useFolderData } from "./useFolderData.js";
import { useFolderExpansion } from "./useFolderExpansion.js";
import { useFolderModals } from "./useFolderModals.js";
import { useTripModals } from "./useTripModals.js";
import { useFolderOperations } from "./useFolderOperations.js";
import { useTripOperations } from "./useTripOperations.js";
import { useNavigation } from "./useNavigation.js";
import { formatDate, getTripDuration } from "../utils/TripManagerUtils.js";
import { useApi } from "../../../../Hooks/useApi.js";

export default function useTripManager() {
    const folderData = useFolderData();
    const folderExpansion = useFolderExpansion();
    const folderModals = useFolderModals();
    const tripModals = useTripModals();
    const folderOperations = useFolderOperations();
    const tripOperations = useTripOperations();
    const navigation = useNavigation();
    const api = useApi();

    // This called here, because the method needs data from the other hooks
    const handleCreateFolder = async (setFormError) => {
        folderData.setError(null);
        await folderOperations.handleCreateFolder(
            folderModals.folderName,
            setFormError,
            folderData.setError,
            folderModals.setShowFolderCreateModal,
            folderData.setFolders
        );
    };

    const handleRenameFolder = async (setFormError) => {
        folderData.setError(null);
        await folderOperations.handleRenameFolder(
            folderModals.folderToRename,
            folderModals.newFolderName,
            setFormError,
            folderData.setError,
            folderModals.setShowFolderRenameModal,
            folderData.setFolders
        );
    };

    const handleDeleteFolder = async () => {
        folderData.setError(null);
        await folderOperations.handleDeleteFolder(
            folderModals.folderToDelete,
            folderData.setError,
            folderModals.setShowFolderDeleteModal,
            folderData.folders,
            folderData.setFolders
        );
    };

    const handleRenameTrip = async (setFormError) => {
        folderData.setError(null);
        await tripOperations.handleRenameTrip(
            tripModals.tripToRename,
            tripModals.newTripName,
            setFormError,
            folderData.setError,
            tripModals.setShowTripRenameModal,
            folderData.loadFolders,
            tripModals.activeFolderId
        );
    };

    const handleDeleteTrip = async () => {
        folderData.setError(null);
        await tripOperations.handleDeleteTrip(
            tripModals.tripToDelete,
            folderData.setError,
            tripModals.setShowTripDeleteModal,
            folderData.loadFolders
        );
    };

    // These are the modal openers
    const onCreateFolder = () => {
        folderData.setError(null);
        folderModals.onCreateFolder();
    };

    const onRenameFolder = (id, name) => {
        folderData.setError(null);
        folderModals.onRenameFolder(id, name);
    };

    const onDeleteFolder = (id) => {
        folderData.setError(null);
        folderModals.onDeleteFolder(id);
    };

    const onRenameTrip = (tripId, name) => {
        folderData.setError(null);
        tripModals.onRenameTrip(tripId, name);
    };

    const onDeleteTrip = (tripId) => {
        folderData.setError(null);
        tripModals.onDeleteTrip(tripId);
    };

    return {
        // State values
        folders: folderData.folders,
        loading: folderData.loading,
        error: folderData.error,

        // State setters
        setLoading: folderData.setLoading,
        setError: folderData.setError,

        // Folder expansion state
        expandedFolders: folderExpansion.expandedFolders,
        setExpandedFolders: folderExpansion.setExpandedFolders,
        toggleFolder: folderExpansion.toggleFolder,

        // Modal visibility states
        showFolderCreateModal: folderModals.showFolderCreateModal,
        showFolderRenameModal: folderModals.showFolderRenameModal,
        showFolderDeleteModal: folderModals.showFolderDeleteModal,
        showTripRenameModal: tripModals.showTripRenameModal,
        showTripDeleteModal: tripModals.showTripDeleteModal,

        // Modal visibility setters
        setShowFolderCreateModal: folderModals.setShowFolderCreateModal,
        setShowFolderRenameModal: folderModals.setShowFolderRenameModal,
        setShowFolderDeleteModal: folderModals.setShowFolderDeleteModal,
        setShowTripRenameModal: tripModals.setShowTripRenameModal,
        setShowTripDeleteModal: tripModals.setShowTripDeleteModal,

        // Folder operations state
        folderToDelete: folderModals.folderToDelete,
        folderToRename: folderModals.folderToRename,
        folderName: folderModals.folderName,
        newFolderName: folderModals.newFolderName,

        // Folder operations setters
        setFolderToDelete: folderModals.setFolderToDelete,
        setFolderToRename: folderModals.setFolderToRename,
        setFolderName: folderModals.setFolderName,
        setNewFolderName: folderModals.setNewFolderName,

        // Trip operations state
        tripToRename: tripModals.tripToRename,
        tripToDelete: tripModals.tripToDelete,
        newTripName: tripModals.newTripName,

        // Trip operations setters
        setTripToRename: tripModals.setTripToRename,
        setTripToDelete: tripModals.setTripToDelete,
        setNewTripName: tripModals.setNewTripName,

        // Handlers - Folder operations
        onCreateFolder,
        onRenameFolder,
        onDeleteFolder,

        // Handlers - Trip operations
        onRenameTrip,
        onDeleteTrip,

        // Actions (API calls)
        handleCreateFolder,
        handleRenameFolder,
        handleDeleteFolder,
        handleRenameTrip,
        handleDeleteTrip,

        // Navigation
        navigateToCreateTrip: navigation.navigateToCreateTrip,
        navigateToTripPlanner: navigation.navigateToTripPlanner,
        navigate: navigation.navigate,

        // Utilities
        loadFolders: folderData.loadFolders,
        getTripDuration,
        formatDate,

        // External dependencies
        api
    };
}