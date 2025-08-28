import React, {createContext, useContext} from 'react';
import {useFolderModals} from "../Hooks/useFolderModals.js";

const FolderModalsContext = createContext(null);

export function FolderModalsProvider({ children }) {
    const folderModals = useFolderModals();

    return (
        <FolderModalsContext.Provider value={folderModals}>
            {children}
        </FolderModalsContext.Provider>
    );
}

export function useFolderModalsProvider() {
    const context = useContext(FolderModalsContext);
    if (!context) {
        throw new Error('useFolderModalsProvider must be used within a FolderModalsProvider');
    }
    return context;
}
