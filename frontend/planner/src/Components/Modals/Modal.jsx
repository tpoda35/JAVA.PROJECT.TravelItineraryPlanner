// components/Modal.jsx
import './Modal.css'; // Shared styles for all modals

export default function Modal({
                                  isOpen,
                                  onClose,
                                  title,
                                  children,
                                  confirmText = "Confirm",
                                  cancelText = "Cancel",
                                  onConfirm,
                                  showCancel = true,
                                  confirmButtonClass = "btn-success"
                              }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {title && <h3>{title}</h3>}
                <div className="modal-body">{children}</div>
                <div className="modal-actions">
                    {showCancel && (
                        <button onClick={onClose} className="btn-cancel">
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className={confirmButtonClass}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}