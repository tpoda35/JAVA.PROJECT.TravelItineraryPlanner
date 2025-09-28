package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.overview.note.OverviewNoteDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.note.OverviewWsDto;

public interface IOverviewNoteWebSocketService {
    OverviewWsDto create(Long overviewId);
    OverviewWsDto update(Long noteId, OverviewNoteDetailsDtoV3 note);
    OverviewWsDto delete(Long noteId);
}
