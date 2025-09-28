package com.travelPlanner.planner.dto.overview.list;

import com.travelPlanner.planner.dto.overview.listItem.OverviewListItemDetailsDtoV1;
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
public class OverviewListDetailsDtoV1 implements Serializable {

    private Long id;
    private String title;
    private List<OverviewListItemDetailsDtoV1> items = new ArrayList<>();

    @Serial
    private static final long serialVersionUID = 1L;

}
