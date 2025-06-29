package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.folder.FolderCreateDto;
import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV1;
import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV2;
import com.travelPlanner.planner.exception.AccessDeniedException;
import com.travelPlanner.planner.exception.FolderNotFoundException;
import com.travelPlanner.planner.mapper.FolderMapper;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.Folder;
import com.travelPlanner.planner.repository.FolderRepository;
import com.travelPlanner.planner.service.IFolderCacheService;
import com.travelPlanner.planner.service.IFolderService;
import com.travelPlanner.planner.service.ITripCacheService;
import com.travelPlanner.planner.service.IUserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
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

    @Async
    @Override
    public CompletableFuture<List<FolderDetailsDtoV1>> getFoldersByLoggedInUser() {
        String loggedInUserId = userService.getUserIdFromContextHolder();
        String logPrefix = "getFoldersByLoggedInUser";

        List<FolderDetailsDtoV1> folders = folderCacheService.getOrLoadFolders(logPrefix, loggedInUserId, () ->
            transactionTemplate.execute(status -> {
                List<Folder> dbFolders = folderRepository.getAllByAppUser_Id(loggedInUserId);
                if (dbFolders.isEmpty()) {
                    throw new FolderNotFoundException("No folder(s) found.");
                }

                for (Folder folder : dbFolders) {
                    Hibernate.initialize(folder.getTrips());
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

        Folder newFolder = FolderMapper.fromStringToFolder(folderCreateDto.getName());
        newFolder.setAppUser(user);

        Folder savedFolder = folderRepository.saveAndFlush(newFolder);

        folderCacheService.evictFoldersByUserId(user.getId());

        return FolderMapper.fromFolderToDetailsDtoV2(savedFolder);
    }

    @Transactional
    @Override
    public FolderDetailsDtoV2 renameFolder(Long folderId, String newFolderName) {
        String logPrefix = "renameFolder";

        Folder folder = findFolderById(folderId);
        String loggedInUserId = userService.getUserIdFromContextHolder();

        validateFolderOwnership(folder, loggedInUserId);

        folder.setName(newFolderName);
        log.info("{} :: Renamed folder with the id {} to {}.", logPrefix, folderId, newFolderName);

        folderCacheService.evictFoldersByUserId(loggedInUserId);

        return FolderMapper.fromFolderToDetailsDtoV2(folder);
    }

    @Transactional
    @Override
    public void deleteFolder(Long folderId) {
        String logPrefix = "deleteFolder";

        Folder folder = findFolderById(folderId);
        String loggedInUserId = userService.getUserIdFromContextHolder();

        validateFolderOwnership(folder, loggedInUserId);

        List<Long> tripIds = folderRepository.findTripIdsByFolderId(folderId);

        folderRepository.delete(folder);

        folderCacheService.evictFoldersByUserId(loggedInUserId);
        tripCacheService.evictTripsByTripIds(tripIds);

        log.info("{} :: Deleted folder with the id {}.", logPrefix, folderId);
    }

    private Folder findFolderById(Long folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> new FolderNotFoundException("Folder not found."));
    }

    private void validateFolderOwnership(Folder folder, String userId) {
        if (!folder.getAppUser().getId().equals(userId)) {
            throw new AccessDeniedException("You are not authorized to access this folder.");
        }
    }
}
