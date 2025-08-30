import React, {createContext, useContext} from 'react';
import {useNoteModals} from "../Hooks/useNoteModals.js";

const NoteModalsContext = createContext(null);

export function NoteModalsProvider({ children }) {
    const noteModals = useNoteModals();

    return (
        <NoteModalsContext.Provider value={noteModals}>
            {children}
        </NoteModalsContext.Provider>
    );
}

export function useNoteModalsProvider() {
    const context = useContext(NoteModalsContext);
    if (!context) {
        throw new Error('useNoteModalsProvider must be used within a NoteModalsProvider');
    }
    return context;
}
