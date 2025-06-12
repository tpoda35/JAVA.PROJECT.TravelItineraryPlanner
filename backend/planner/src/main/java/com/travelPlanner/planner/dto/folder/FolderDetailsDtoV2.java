package com.travelPlanner.planner.dto.folder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FolderDetailsDtoV2 {

    private Long id;
    private String name;
    private LocalDateTime createdAt;

}
