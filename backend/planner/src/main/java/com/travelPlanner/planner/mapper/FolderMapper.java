package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV1;
import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV2;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV2;
import com.travelPlanner.planner.model.Folder;

import java.util.List;

public class FolderMapper {

    public static List<FolderDetailsDtoV1> fromFolderListToDetailsDtoV1List(List<Folder> folders) {
        return folders.stream()
                .map(folder -> FolderDetailsDtoV1.builder()
                        .id(folder.getId())
                        .name(folder.getName())
                        .trips(
                                folder.getTrips().stream().map(trip -> TripDetailsDtoV2.builder()
                                                .id(trip.getId())
                                                .name(trip.getName())
                                                .destination(trip.getDestination())
                                                .startDate(trip.getStartDate())
                                                .endDate(trip.getEndDate())
                                                .build())
                                        .toList()
                        )
                        .createdAt(folder.getCreatedAt())
                        .build())
                .toList();
    }

    public static Folder fromStringToFolder(String folderName) {
        return Folder.builder()
                .name(folderName)
                .build();
    }

    public static FolderDetailsDtoV2 fromFolderToDetailsDtoV2(Folder folder) {
        return FolderDetailsDtoV2.builder()
                .id(folder.getId())
                .name(folder.getName())
                .createdAt(folder.getCreatedAt())
                .build();
    }

}
