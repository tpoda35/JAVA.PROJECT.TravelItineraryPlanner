import { Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import BaseModal from "./BaseModal.jsx";

/**
 * A reusable confirmation modal built on top of {@link BaseModal}.
 * Displays a title, optional content, and Cancel/Confirm action buttons.
 *
 * @param {boolean} open - Whether the modal is open
 * @param {string|JSX.Element} title - Title text or node displayed at the top of the modal
 * @param {string|JSX.Element} [content] - Optional content/message displayed inside the modal body
 * @param {function(): void} [onCancel] - Callback fired when the user clicks the Cancel button or closes the modal
 * @param {function(): void} [onConfirm] - Callback fired when the user clicks the Confirm button
 * @param {string} [confirmText="Confirm"] - Label text for the confirm button
 * @param {string} [cancelText="Cancel"] - Label text for the cancel button
 * @param {"inherit"|"primary"|"secondary"|"success"|"error"|"info"|"warning"} [confirmColor="primary"] - MUI color applied to the confirm button
 * @returns {JSX.Element} A confirmation modal with cancel and confirm actions
 *
 * @example
 * // Basic confirm modal
 * <ConfirmModal
 *   open={isOpen}
 *   title="Delete Item"
 *   content="Are you sure you want to delete this item?"
 *   onCancel={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 * />
 *
 * @example
 * // Custom button labels and color
 * <ConfirmModal
 *   open={isOpen}
 *   title="Submit Form"
 *   content="Do you want to submit the form now?"
 *   confirmText="Submit"
 *   cancelText="Back"
 *   confirmColor="success"
 *   onCancel={() => setIsOpen(false)}
 *   onConfirm={handleSubmit}
 * />
 */
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