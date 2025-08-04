package com.travelPlanner.planner.dto.folder;

import com.travelPlanner.planner.dto.trip.TripDetailsDtoV2;
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
    private List<TripDetailsDtoV2> trips = new ArrayList<>();
    private LocalDateTime createdAt;

}
