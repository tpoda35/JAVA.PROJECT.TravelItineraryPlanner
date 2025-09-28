package com.travelPlanner.planner.dto.websocket.note;

import com.travelPlanner.planner.dto.overview.list.OverviewListDetailsDtoV3;
import com.travelPlanner.planner.dto.overview.listItem.OverviewListItemDetailsDtoV3;
import com.travelPlanner.planner.dto.overview.note.OverviewNoteDetailsDtoV3;
import com.travelPlanner.planner.enums.OverviewWsType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//@ValidNoteWsRequest
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OverviewWsDto {

    // If a note/list is created, we only need the destination variable
    // and the type.
    @NotNull(message = "Type is required.")
    @Enumerated(EnumType.STRING)
    private OverviewWsType type;

    private Long entityId; // only used for requests

    private OverviewNoteDetailsDtoV3 note;
    private OverviewListDetailsDtoV3 list;
    private OverviewListItemDetailsDtoV3 listItem;

}
