package com.travelPlanner.planner.dto.trip;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripDetailsDtoV2 {

    private Long id;
    private String name;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;

}
