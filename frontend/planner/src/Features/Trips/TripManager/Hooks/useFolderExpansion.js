import {useCallback} from "react";

export function useFolderExpansion() {

    const toggleFolder = useCallback((folderId, setExpandedFolders) => {
        setExpandedFolders(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(folderId)) {
                newExpanded.delete(folderId);
            } else {
                newExpanded.add(folderId);
            }
            return newExpanded;
        });
    }, []);

    return {
        toggleFolder
    };
}