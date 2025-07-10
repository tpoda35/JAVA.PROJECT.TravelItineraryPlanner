package com.travelPlanner.planner.dto.activity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotBlank(message = "Title is required.")
    private String title;

    private String description;

    @NotNull(message = "Start date is required.")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required.")
    private LocalDateTime endDate;

}
