import React, {createContext, useContext} from 'react';
import {useFolderExpansion} from "../Hooks/useFolderExpansion.js";

const FolderExpansionContext = createContext(null);

export function FolderExpansionProvider({ children }) {
    const folderExpansion = useFolderExpansion()

    return (
        <FolderExpansionContext.Provider value={folderExpansion}>
            {children}
        </FolderExpansionContext.Provider>
    );
}

export function useFolderExpansionProvider() {
    const context = useContext(FolderExpansionContext);
    if (!context) {
        throw new Error('useFolderExpansionProvider must be used within a FolderExpansionProvider');
    }
    return context;
}
