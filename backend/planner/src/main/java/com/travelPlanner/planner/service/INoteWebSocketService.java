package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.websocket.note.NoteWsDto;

public interface INoteWebSocketService {
    NoteWsDto create(Long tripId);
    NoteWsDto update(Long noteId, String content);
    NoteWsDto delete(Long noteId);
}
