package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV1;

import java.util.List;
import java.util.function.Supplier;

public interface IFolderCacheService {

    List<FolderDetailsDtoV1> getOrLoadFolders(String logPrefix, String userId, Supplier<List<FolderDetailsDtoV1>> dbLoader);
    void evictFoldersByUserId(String userId);

}
