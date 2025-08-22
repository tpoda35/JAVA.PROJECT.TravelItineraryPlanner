import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useCallback } from "react";

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