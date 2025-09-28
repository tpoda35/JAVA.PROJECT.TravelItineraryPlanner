package com.travelPlanner.planner.dto.overview.listItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OverviewListItemDetailsDtoV3 {

    private Long id;
    private String content;

}
