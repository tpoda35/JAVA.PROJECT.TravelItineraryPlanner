import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useCallback } from "react";

/**
 * A reusable base modal component built on top of Material-UI's `Dialog`.
 * Provides a title, content area, and optional configurable action buttons.
 *
 * @param {boolean} open - Whether the modal is open
 * @param {function(): void} onClose - Callback fired when the modal requests to be closed
 * @param {string|JSX.Element} title - The title displayed at the top of the modal
 * @param {React.ReactNode} children - Content of the modal body
 * @param {Array<{
 *   label: string,
 *   onClick: function(): void,
 *   color?: "inherit"|"primary"|"secondary"|"success"|"error"|"info"|"warning",
 *   variant?: "text"|"outlined"|"contained",
 *   disabled?: boolean
 * }>} [actions=[]] - Array of action button configurations rendered in the footer
 * @param {boolean} [disableScrollLock=true] - Whether to disable scroll locking when the modal is open
 * @param {"xs"|"sm"|"md"|"lg"|"xl"|false} [maxWidth="sm"] - Maximum width of the modal
 * @param {boolean} [fullWidth=true] - Whether the modal should stretch to the full width of the screen up to `maxWidth`
 * @returns {JSX.Element} A Material-UI modal dialog with a title, content, and optional actions
 *
 * @example
 * // Basic modal
 * <BaseModal
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Confirm Action"
 * >
 *   <p>Are you sure you want to continue?</p>
 * </BaseModal>
 *
 * @example
 * // Modal with actions
 * <BaseModal
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Delete Item"
 *   actions={[
 *     { label: "Cancel", onClick: () => setOpen(false) },
 *     { label: "Delete", onClick: handleDelete, color: "error", variant: "contained" }
 *   ]}
 * >
 *   <p>This action cannot be undone.</p>
 * </BaseModal>
 */
export default function BaseModal({
                                      open,
                                      onClose,
                                      title,
                                      children,
                                      actions = [],
                                      disableScrollLock = true,
                                      maxWidth = "sm",
                                      fullWidth = true
                                  }) {
    const handleClose = useCallback(() => {
        onClose?.();
    }, [onClose]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            disableScrollLock={disableScrollLock}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        onClick={action.onClick}
                        color={action.color || "inherit"}
                        variant={action.variant || "text"}
                        disabled={action.disabled}
                    >
                        {action.label}
                    </Button>
                ))}
            </DialogActions>
        </Dialog>
    );
}