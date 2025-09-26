package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.exception.AccessDeniedException;
import com.travelPlanner.planner.exception.FolderNotFoundException;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.Folder;
import com.travelPlanner.planner.repository.FolderRepository;
import com.travelPlanner.planner.service.IFolderPermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FolderPermissionService implements IFolderPermissionService {

    private final FolderRepository folderRepository;

    /**
     * Fast folder validation - single query, no entity loading
     */
    @Override
    public void validateFolderOwnership(String logPrefix, Long folderId, String userId) {
        boolean isAuthorized = folderRepository.existsByIdAndUserId(folderId, userId);

        if (!isAuthorized) {
            denyAccess(logPrefix, folderId, userId);
        }
    }

    /**
     * Get folder with validation in single operation
     * * Use when you need the folder entity after validation
     */
    @Override
    public Folder getFolderWithValidation(String logPrefix, Long folderId, String userId) {
        Folder folder = folderRepository.findByIdWithUser(folderId)
                .orElseThrow(() -> {
                    log.info("{} :: Folder not found with the id {}.", logPrefix, folderId);
                    return new FolderNotFoundException("Folder not found");
                });

        validateFolderOwnershipFromLoadedFolder(logPrefix, folder, userId);
        return folder;
    }

    /**
     * Validate folder ownership from already loaded folder (no additional queries)
     */
    @Override
    public void validateFolderOwnershipFromLoadedFolder(String logPrefix, Folder folder, String userId) {
        AppUser appUser = folder.getAppUser();
        if (appUser == null || !userId.equals(appUser.getId())) {
            denyAccess(logPrefix, folder.getId(), userId);
        }
    }

    private void denyAccess(String logPrefix, Long folderId, String userId) {
        log.warn("{} :: Unauthorized access attempt on Folder id {} by userId {}.",
                logPrefix, folderId, userId);
        throw new AccessDeniedException("You are not authorized to access this folder.");
    }
}
