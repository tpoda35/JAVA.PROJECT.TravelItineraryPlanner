import { TextField } from "@mui/material";
import {useCallback, useState} from "react";
import { useTripManagerContext } from "../../Contexts/TripManagerContext.js";
import BaseModal from "../../../../../Components/Modal/BaseModal.jsx";

export default function TripRenameModal() {
    const {
        // Modal states
        showTripRenameModal,
        setShowTripRenameModal,

        // New name
        newTripName,
        setNewTripName,

        handleRenameTrip
    } = useTripManagerContext();

    const [formError, setFormError] = useState("");

    const handleTripNameChange = useCallback((e) => {
        setNewTripName(e.target.value);
        if (formError) {
            setFormError(null);
        }
    }, [setNewTripName, formError]);

    const handleClose = useCallback(() => {
        setShowTripRenameModal(false);
        setFormError(null);
    }, [setShowTripRenameModal]);

    const actions = [
        {
            label: "Cancel",
            onClick: handleClose
        },
        {
            label: "Save",
            onClick: async () => {
                const ok = await handleRenameTrip(setFormError);
                if (ok) handleClose();
            },
            color: "primary",
            variant: "contained"
        }
    ];

    return (
        <BaseModal
            open={showTripRenameModal}
            onClose={handleClose}
            title="Rename Trip"
            actions={actions}
        >
            <TextField
                label="New Trip Name"
                value={newTripName}
                onChange={handleTripNameChange}
                error={Boolean(formError)}
                helperText={formError || ' '}
                fullWidth
                autoFocus
                margin="dense"
            />
        </BaseModal>
    );
}