import { useState, useCallback } from 'react';

/**
 * Custom hook for handling inline editing with keyboard controls.
 * Provides consistent editing behavior across the application with Enter/Escape support.
 *
 * @param {string} originalValue - The original value to edit
 * @param {Function} onSave - Callback when Enter is pressed and value changed
 * @param {Function} [onCancel] - Optional callback when Escape is pressed
 * @param {boolean} [resetOnCancel=true] - Whether to reset to original value on cancel
 * @param {boolean} [autoSave=false] - Whether to auto-save on blur (clicking away)
 * @returns {{
 *   isEditing: boolean,
 *   editValue: string,
 *   setEditValue: function(string): void,
 *   startEditing: function(): void,
 *   stopEditing: function(): void,
 *   handleKeyDown: function(KeyboardEvent): void,
 *   handleBlur: function(): void,
 *   handleSave: function(): void,
 *   handleCancel: function(): void
 * }} Object containing editing state and control functions
 *
 * @example
 * // Basic usage with manual save
 * const editor = useEditableField({
 *   originalValue: activity.title,
 *   onSave: (newTitle) => updateActivity(newTitle)
 * });
 *
 * @example
 * // With auto-save enabled
 * const editor = useEditableField({
 *   originalValue: note.content,
 *   onSave: (content) => saveNote(content),
 *   autoSave: true
 * });
 */
export function useEditableField(
    originalValue,
    onSave,
    onCancel,
    resetOnCancel = true,
    autoSave = false
) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(originalValue || '');

    const startEditing = useCallback(() => {
        setEditValue(originalValue || '');
        setIsEditing(true);
    }, [originalValue]);

    const stopEditing = useCallback(() => {
        setIsEditing(false);
    }, []);

    const handleSave = useCallback(() => {
        if (editValue !== originalValue && onSave) {
            onSave(editValue);
        }
        stopEditing();
    }, [editValue, originalValue, onSave, stopEditing]);

    const handleCancel = useCallback(() => {
        if (resetOnCancel) {
            setEditValue(originalValue || '');
        }
        if (onCancel) {
            onCancel();
        }
        stopEditing();
    }, [originalValue, onCancel, resetOnCancel, stopEditing]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        }
    }, [handleSave, handleCancel]);

    const handleBlur = useCallback(() => {
        if (autoSave) {
            handleSave();
        } else {
            stopEditing();
        }
    }, [autoSave, handleSave, stopEditing]);

    return {
        isEditing,
        editValue,
        setEditValue,
        startEditing,
        stopEditing,
        handleKeyDown,
        handleBlur,
        handleSave,
        handleCancel
    };
}