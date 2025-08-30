package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.websocket.note.NoteWsDto;
import com.travelPlanner.planner.exception.TripNotFoundException;
import com.travelPlanner.planner.exception.TripNoteNotFoundException;
import com.travelPlanner.planner.mapper.TripNoteMapper;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.model.TripNote;
import com.travelPlanner.planner.repository.TripNoteRepository;
import com.travelPlanner.planner.repository.TripRepository;
import com.travelPlanner.planner.service.INoteWebSocketService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static com.travelPlanner.planner.Enum.NoteWsType.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class NoteWebSocketService implements INoteWebSocketService {

    private final TripNoteRepository tripNoteRepository;
    private final TripRepository tripRepository;

    @Transactional
    @Override
    public NoteWsDto create(Long tripId) {
        String logPrefix = "WsNoteCreate";

        TripNote newTripNote = TripNoteMapper.createTripNote(findTripById(logPrefix, tripId));

        log.info("{} :: Creating new Note.", logPrefix);
        return TripNoteMapper.createNoteWsDto(tripNoteRepository.save(newTripNote), NOTE_CREATED);
    }

    @Transactional
    @Override
    public NoteWsDto update(Long noteId, String content) {
        String logPrefix = "WsNoteUpdate";

        TripNote tripNote = findTripNoteById(logPrefix, noteId);
        tripNote.setContent(content);

        log.info("{} :: Updated Note content with id {} to {}.", logPrefix, noteId, content);

        return TripNoteMapper.createNoteWsDto(tripNote, NOTE_UPDATED);
    }

    @Transactional
    @Override
    public NoteWsDto delete(Long noteId) {
        String logPrefix = "WsNoteDelete";

        tripNoteRepository.delete(
                findTripNoteById(logPrefix, noteId)
        );

        log.info("{} :: Deleted Note with id {}.", logPrefix, noteId);

        return TripNoteMapper.createNoteWsDto(noteId, NOTE_DELETED);
    }

    private Trip findTripById(String logPrefix, Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> {
                    log.info("{} :: Trip not found with the id {}.", logPrefix, tripId);
                    return new TripNotFoundException("Trip not found.");
                });
    }

    private TripNote findTripNoteById(String logPrefix, Long noteId) {
        return tripNoteRepository.findById(noteId)
                .orElseThrow(() -> {
                    log.info("{} :: Note not found with the id {}.", logPrefix, noteId);
                    return new TripNoteNotFoundException("Note not found.");
                });
    }
}
