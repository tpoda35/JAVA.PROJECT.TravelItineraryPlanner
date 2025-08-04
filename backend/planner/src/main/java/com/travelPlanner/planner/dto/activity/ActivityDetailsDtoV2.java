package com.travelPlanner.planner.dto.activity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityDetailsDtoV2 {

    private Long id;
    private String title;
    private String description;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
