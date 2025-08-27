package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.Enum.NoteWsType;
import com.travelPlanner.planner.dto.websocket.note.NoteWsDto;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.model.TripNote;

public class TripNoteMapper {

    public static TripNote createTripNote(Trip trip) {
        return TripNote.builder()
                .trip(trip)
                .build();
    }

    public static NoteWsDto createNoteWsDto(TripNote tripNote, NoteWsType type) {
        return NoteWsDto.builder()
                .type(type)
                .noteId(tripNote.getId())
                .content(tripNote.getContent())
                .build();
    }

    public static NoteWsDto createNoteWsDto(Long noteId, NoteWsType type) {
        return NoteWsDto.builder()
                .type(type)
                .noteId(noteId)
                .build();
    }

}
