package com.travelPlanner.planner.dto.overview.list;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OverviewListDetailsDtoV3 {

    private Long id;
    private String title;

}
