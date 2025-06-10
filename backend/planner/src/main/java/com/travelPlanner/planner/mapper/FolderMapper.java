package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV1;
import com.travelPlanner.planner.model.Folder;

import java.util.List;

public class FolderMapper {

    public static List<FolderDetailsDtoV1> fromFolderListToDetailsDtoV1List(List<Folder> folders) {
        return folders.stream()
                .map(folder -> FolderDetailsDtoV1.builder()
                        .id(folder.getId())
                        .name(folder.getName())
                        .isDefault(folder.isDefault())
                        .isDeletable(folder.isDeletable())
                        .trips(folder.getTrips())
                        .createdAt(folder.getCreatedAt())
                        .build())
                .toList();
    }

}
