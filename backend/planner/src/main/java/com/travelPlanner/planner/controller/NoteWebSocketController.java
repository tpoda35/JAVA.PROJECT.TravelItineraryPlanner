package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.websocket.note.NoteWsDto;
import com.travelPlanner.planner.service.INoteWebSocketService;
import com.travelPlanner.planner.service.ITripCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;


@Controller
@Slf4j
@RequiredArgsConstructor
public class NoteWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final INoteWebSocketService noteWebSocketService;
    private final ITripCacheService tripCacheService;

    @MessageMapping("/trips/{tripId}/notes")
    public void handleNotesMessage(@DestinationVariable Long tripId, @Payload NoteWsDto payload) {
        String logPrefix = "handleNotesMessage";
        log.info("{} :: Received message. tripId: {}, payload: {}", logPrefix, tripId, payload);

        NoteWsDto result = null;
        switch (payload.getType()) {
            case NOTE_CREATED -> result = noteWebSocketService.create(tripId);
            case NOTE_UPDATED -> result = noteWebSocketService.update(payload.getNoteId(), payload.getContent());
            case NOTE_DELETED -> result = noteWebSocketService.delete(payload.getNoteId());
            default -> log.warn("{} :: Unknown request type: {}", logPrefix, payload.getType());
        }

        if (result != null) {
            broadcastNoteChange(tripId, result);
        }
    }

    private void broadcastNoteChange(Long tripId, NoteWsDto note) {
        tripCacheService.evictTripByTripId(tripId);
        messagingTemplate.convertAndSend("/topic/trips/" + tripId + "/notes", note);
    }
}
