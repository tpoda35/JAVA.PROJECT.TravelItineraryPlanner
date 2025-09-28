package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.overview.note.OverviewNoteDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.note.OverviewWsDto;
import com.travelPlanner.planner.exception.OverviewNoteNotFoundException;
import com.travelPlanner.planner.exception.TripOverviewNotFound;
import com.travelPlanner.planner.mapper.OverviewWsMapper;
import com.travelPlanner.planner.model.OverviewNote;
import com.travelPlanner.planner.model.TripOverview;
import com.travelPlanner.planner.repository.OverviewNoteRepository;
import com.travelPlanner.planner.repository.TripOverviewRepository;
import com.travelPlanner.planner.service.IOverviewNoteWebSocketService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static com.travelPlanner.planner.enums.OverviewWsType.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class OverviewNoteWebSocketService implements IOverviewNoteWebSocketService {

    private final OverviewNoteRepository overviewNoteRepository;
    private final TripOverviewRepository tripOverviewRepository;

    @Transactional
    @Override
    public OverviewWsDto create(Long overviewId) {
        String logPrefix = "WsNoteCreate";

        OverviewNote newNote = OverviewWsMapper.createNoteOverviewWsDto(findTripOverviewById(logPrefix, overviewId));

        log.info("{} :: Creating new Note.", logPrefix);
        return OverviewWsMapper.createNoteOverviewWsDto(NOTE_CREATED, overviewNoteRepository.save(newNote));
    }

    @Transactional
    @Override
    public OverviewWsDto update(Long noteId, OverviewNoteDetailsDtoV3 note) {
        String logPrefix = "WsNoteUpdate";

        OverviewNote overviewNote = findOverviewNoteById(logPrefix, noteId);
        overviewNote.setContent(note.getContent());

        log.info("{} :: Updated Note content with id {} to {}.", logPrefix, noteId, note.getContent());

        return OverviewWsMapper.createNoteOverviewWsDto(NOTE_UPDATED_CONTENT, overviewNote);
    }

    @Transactional
    @Override
    public OverviewWsDto delete(Long noteId) {
        String logPrefix = "WsNoteDelete";

        overviewNoteRepository.delete(
                findOverviewNoteById(logPrefix, noteId)
        );

        log.info("{} :: Deleted Note with id {}.", logPrefix, noteId);

        return OverviewWsMapper.createDeleteNoteOverviewWsDto(noteId);
    }

    private TripOverview findTripOverviewById(String logPrefix, Long overviewId) {
        return tripOverviewRepository.findById(overviewId)
                .orElseThrow(() -> {
                    log.info("{} :: Overview not found with the id {}.", logPrefix, overviewId);
                    return new TripOverviewNotFound("Overview not found.");
                });
    }

    private OverviewNote findOverviewNoteById(String logPrefix, Long noteId) {
        return overviewNoteRepository.findById(noteId)
                .orElseThrow(() -> {
                    log.info("{} :: Note not found with the id {}.", logPrefix, noteId);
                    return new OverviewNoteNotFoundException("Note not found.");
                });
    }
}
