package com.travelPlanner.planner.dto.overview.note;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OverviewNoteDetailsDtoV3 {

    private Long id;
    private String content;

}
