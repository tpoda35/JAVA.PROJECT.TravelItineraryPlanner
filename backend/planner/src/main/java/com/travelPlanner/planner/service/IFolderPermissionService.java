package com.travelPlanner.planner.service;

import com.travelPlanner.planner.model.Folder;

public interface IFolderPermissionService {
    void validateFolderOwnership(String logPrefix, Long folderId, String userId);
    Folder getFolderWithValidation(String logPrefix, Long folderId, String userId);
    void validateFolderOwnershipFromLoadedFolder(String logPrefix, Folder folder, String userId);
}
