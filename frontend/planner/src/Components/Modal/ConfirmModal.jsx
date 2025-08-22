// ConfirmModal.jsx - Updated to use BaseModal
import { Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import BaseModal from "./BaseModal.jsx";

export default function ConfirmModal({
                                         open,
                                         title,
                                         content,
                                         onCancel,
                                         onConfirm,
                                         confirmText = "Confirm",
                                         cancelText = "Cancel",
                                         confirmColor = "primary",
                                     }) {
    const handleCancel = useCallback(() => {
        onCancel?.();
    }, [onCancel]);

    const handleConfirm = useCallback(() => {
        onConfirm?.();
    }, [onConfirm]);

    const actions = useMemo(() => [
        {
            label: cancelText,
            onClick: handleCancel
        },
        {
            label: confirmText,
            onClick: handleConfirm,
            color: confirmColor,
            variant: "contained"
        }
    ], [cancelText, confirmText, confirmColor, handleCancel, handleConfirm]);

    return (
        <BaseModal
            open={open}
            onClose={handleCancel}
            title={title}
            actions={actions}
        >
            {content && <Typography>{content}</Typography>}
        </BaseModal>
    );
}