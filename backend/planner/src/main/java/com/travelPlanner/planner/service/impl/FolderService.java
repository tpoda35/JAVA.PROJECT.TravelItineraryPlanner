package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.folder.FolderCreateDto;
import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV1;
import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV2;
import com.travelPlanner.planner.exception.FolderNotFoundException;
import com.travelPlanner.planner.mapper.FolderMapper;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.Folder;
import com.travelPlanner.planner.repository.FolderRepository;
import com.travelPlanner.planner.service.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class FolderService implements IFolderService {

    private final IUserService userService;
    private final IFolderCacheService folderCacheService;
    private final TransactionTemplate transactionTemplate;
    private final FolderRepository folderRepository;
    private final ITripCacheService tripCacheService;
    private final IFolderPermissionService folderPermissionService;

    @Async
    @Override
    public CompletableFuture<List<FolderDetailsDtoV1>> getFoldersByLoggedInUser() {
        String logPrefix = "getFoldersByLoggedInUser";
        String loggedInUserId = userService.getUserIdFromContextHolder();

        List<FolderDetailsDtoV1> folders = folderCacheService.getOrLoadFolders(logPrefix, loggedInUserId, () ->
            transactionTemplate.execute(status -> {
                List<Folder> dbFolders = folderRepository.getAllByAppUserId(loggedInUserId);
                if (dbFolders.isEmpty()) {
                    log.info("{} :: No folder(s) found with userId {}.", logPrefix, loggedInUserId);
                    throw new FolderNotFoundException("No folder(s) found.");
                }

                return FolderMapper.fromFolderListToDetailsDtoV1List(dbFolders);
            })
        );

        return CompletableFuture.completedFuture(
            folders
        );
    }

    @Transactional
    @Override
    public FolderDetailsDtoV2 addFolderToLoggedInUser(FolderCreateDto folderCreateDto) {
        String logPrefix = "addFolderToLoggedInUser";

        AppUser user = userService.getLoggedInUser();
        log.info("{} :: Creating folder for userId {}.", logPrefix, user.getId());

        Folder newFolder = FolderMapper.fromStringToFolder(folderCreateDto.getName());
        newFolder.setAppUser(user);

        Folder savedFolder = folderRepository.saveAndFlush(newFolder);
        log.info("{} :: Created folder for userId {}.", logPrefix, user.getId());

        folderCacheService.evictFoldersByUserId(user.getId());

        return FolderMapper.fromFolderToDetailsDtoV2(savedFolder);
    }

    @Transactional
    @Override
    public FolderDetailsDtoV2 renameFolder(Long folderId, String newFolderName) {
        String logPrefix = "renameFolder";
        log.info("{} :: Renaming folder with the id {}.", logPrefix, folderId);

        Folder folder = findFolderById(logPrefix, folderId);
        String loggedInUserId = userService.getUserIdFromContextHolder();

        folderPermissionService.validateFolderOwnership(logPrefix, folderId, loggedInUserId);

        folder.setName(newFolderName);
        log.info("{} :: Renamed folder with the id {} to {}.", logPrefix, folderId, newFolderName);

        folderCacheService.evictFoldersByUserId(loggedInUserId);

        return FolderMapper.fromFolderToDetailsDtoV2(folder);
    }

    @Transactional
    @Override
    public void deleteFolder(Long folderId) {
        String logPrefix = "deleteFolder";
        log.info("{} :: Deleting folder with the id {}.", logPrefix, folderId);

        Folder folder = findFolderById(logPrefix, folderId);
        String loggedInUserId = userService.getUserIdFromContextHolder();

        folderPermissionService.validateFolderOwnership(logPrefix, folderId, loggedInUserId);

        List<Long> tripIds = folderRepository.findTripIdsByFolderId(folderId);

        folderRepository.delete(folder);
        log.info("{} :: Deleted folder with the id {}.", logPrefix, folderId);

        folderCacheService.evictFoldersByUserId(loggedInUserId);
        tripCacheService.evictTripsByTripIds(tripIds);
    }

    private Folder findFolderById(String logPrefix, Long folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> {
                    log.info("{} :: Folder not found with the id {}.", logPrefix, folderId);
                    return new FolderNotFoundException("Folder not found.");
                });
    }
}
