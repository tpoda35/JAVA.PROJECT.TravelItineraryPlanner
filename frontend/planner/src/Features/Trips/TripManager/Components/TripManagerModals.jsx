import CustomModal from "../../../../Components/Modals/CustomModal.jsx";
import CustomInput from "../../../../Components/Input/CustomInput.jsx";
import {useTripManagerContext} from "../Contexts/TripManagerContext.js";


export default function TripManagerModals() {
    const props = useTripManagerContext();

    return (
        <>
            {/* Trip Delete CustomModal */}
            <CustomModal
                isOpen={props.showTripDeleteModal}
                onClose={() => {
                    props.setShowTripDeleteModal(false);
                    props.setError(null);
                }}
                onConfirm={props.handleDeleteTrip}
                title="Delete Trip"
                confirmText="Delete"
                confirmButtonClass="btn-danger"
            >
                <p>Are you sure?</p>
            </CustomModal>

            {/* Trip Rename CustomModal */}
            <CustomModal
                isOpen={props.showTripRenameModal}
                onClose={() => {
                    props.setShowTripRenameModal(false);
                    props.setError(null);
                }}
                onConfirm={props.handleRenameTrip}
                title="Rename Trip"
                confirmText="Save"
                confirmButtonClass="btn-success"
            >
                <CustomInput
                    label="New Trip Name"
                    value={props.newTripName}
                    onChange={(e) => {
                        props.setNewTripName(e.target.value);
                        props.setError(null);
                    }}
                    placeholder="Enter new name"
                    error={props.error}
                    autoFocus
                />
            </CustomModal>

            {/* Folder Rename CustomModal */}
            <CustomModal
                isOpen={props.showFolderRenameModal}
                onClose={() => {
                    props.setShowFolderRenameModal(false);
                    props.setError(null);
                }}
                onConfirm={props.handleRenameFolder}
                title="Rename Folder"
                confirmText="Save"
                confirmButtonClass="btn-success"
            >
                <CustomInput
                    label="New Folder Name"
                    value={props.newFolderName}
                    onChange={(e) => {
                        props.setNewFolderName(e.target.value);
                        props.setError(null);
                    }}
                    placeholder="Enter new name"
                    error={props.error}
                    autoFocus
                />
            </CustomModal>

            {/* Folder Create CustomModal */}
            <CustomModal
                isOpen={props.showFolderCreateModal}
                onClose={() => {
                    props.setShowFolderCreateModal(false);
                    props.setError(null);
                }}
                onConfirm={props.handleCreateFolder}
                title="Create Folder"
                confirmText="Create"
                confirmButtonClass="btn-success"
            >
                <CustomInput
                    label="Folder Name"
                    value={props.folderName}
                    onChange={(e) => {
                        props.setFolderName(e.target.value);
                        props.setError(null);
                    }}
                    placeholder="Enter folder name"
                    error={props.error}
                    autoFocus
                />
            </CustomModal>

            {/* Folder Delete CustomModal */}
            <CustomModal
                isOpen={props.showFolderDeleteModal}
                onClose={() => {
                    props.setShowFolderDeleteModal(false);
                    props.setError(null);
                }}
                onConfirm={props.handleDeleteFolder}
                title="Delete Folder"
                confirmText="Delete"
                confirmButtonClass="btn-danger"
            >
                <p>Are you sure? All trips in this folder will be deleted.</p>
            </CustomModal>
        </>
    );
}
