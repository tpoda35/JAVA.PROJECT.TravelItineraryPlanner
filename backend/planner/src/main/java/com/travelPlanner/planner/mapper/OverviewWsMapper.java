package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.overview.list.OverviewListDetailsDtoV3;
import com.travelPlanner.planner.dto.overview.note.OverviewNoteDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.note.OverviewWsDto;
import com.travelPlanner.planner.enums.OverviewWsType;
import com.travelPlanner.planner.model.OverviewList;
import com.travelPlanner.planner.model.OverviewNote;
import com.travelPlanner.planner.model.TripOverview;

import static com.travelPlanner.planner.enums.OverviewWsType.LIST_DELETED;
import static com.travelPlanner.planner.enums.OverviewWsType.NOTE_DELETED;

public class OverviewWsMapper {

    // Note part
    public static OverviewNote createNoteOverviewWsDto(TripOverview overview) {
        return OverviewNote.builder()
                .overview(overview)
                .build();
    }

    public static OverviewWsDto createNoteOverviewWsDto(OverviewWsType type, OverviewNote note) {
        return OverviewWsDto.builder()
                .type(type)
                .note(
                        OverviewNoteDetailsDtoV3.builder()
                                .id(note.getId())
                                .content(note.getContent())
                                .build()
                )
                .build();
    }

    public static OverviewWsDto createDeleteNoteOverviewWsDto(Long noteId) {
        return OverviewWsDto.builder()
                .type(NOTE_DELETED)
                .note(
                        OverviewNoteDetailsDtoV3.builder()
                                .id(noteId)
                                .build()
                )
                .build();
    }

    // List part
    public static OverviewList createListOverviewWsDto(TripOverview overview) {
        return OverviewList.builder()
                .overview(overview)
                .build();
    }

    public static OverviewWsDto createListOverviewWsDto(OverviewWsType type, OverviewList list) {
        return OverviewWsDto.builder()
                .type(type)
                .list(
                        OverviewListDetailsDtoV3.builder()
                                .id(list.getId())
                                .title(list.getTitle())
                                .build()
                )
                .build();
    }

    public static OverviewWsDto createDeleteListOverviewWsDto(Long listId) {
        return OverviewWsDto.builder()
                .type(LIST_DELETED)
                .list(
                        OverviewListDetailsDtoV3.builder()
                                .id(listId)
                                .build()
                )
                .build();
    }
}
