import {useState} from "react";

export function useNoteModals() {
    const [showNoteDeleteModal, setShowNoteDeleteModal] = useState(false);
    const [showNoteAddModal, setShowNoteAddModal] = useState(false);

    const [noteToDelete, setNoteToDelete] = useState(null);

    return {
        showNoteDeleteModal,
        setShowNoteDeleteModal,

        showNoteAddModal,
        setShowNoteAddModal,

        noteToDelete,
        setNoteToDelete
    }
}