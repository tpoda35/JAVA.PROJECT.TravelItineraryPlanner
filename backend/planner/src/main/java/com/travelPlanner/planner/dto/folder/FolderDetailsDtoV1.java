package com.travelPlanner.planner.dto.folder;

import com.travelPlanner.planner.model.Trip;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FolderDetailsDtoV1 implements Serializable {

    private Long id;
    private String name;
    private boolean isDefault;
    private boolean isDeletable;
    private List<Trip> trips = new ArrayList<>();
    private LocalDateTime createdAt;

}
