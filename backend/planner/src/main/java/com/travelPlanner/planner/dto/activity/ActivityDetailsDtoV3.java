package com.travelPlanner.planner.dto.activity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityDetailsDtoV3 {

    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

}
