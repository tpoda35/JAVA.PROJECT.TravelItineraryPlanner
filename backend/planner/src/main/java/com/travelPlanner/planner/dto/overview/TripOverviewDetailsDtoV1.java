package com.travelPlanner.planner.dto.overview;

import com.travelPlanner.planner.dto.overview.list.OverviewListDetailsDtoV1;
import com.travelPlanner.planner.dto.overview.note.OverviewNoteDetailsDtoV1;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripOverviewDetailsDtoV1 implements Serializable {

    private Long id;
    private List<OverviewNoteDetailsDtoV1> notes = new ArrayList<>();
    private List<OverviewListDetailsDtoV1> lists = new ArrayList<>();

    @Serial
    private static final long serialVersionUID = 1L;

}
