package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.folder.FolderCreateDto;
import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV1;
import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV2;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IFolderService {
    CompletableFuture<List<FolderDetailsDtoV1>> getFoldersByLoggedInUser();
    FolderDetailsDtoV2 addFolderToLoggedInUser(FolderCreateDto folderName);
    FolderDetailsDtoV2 renameFolder(Long folderId, String newFolderName);
    void deleteFolder(Long folderId);
}
