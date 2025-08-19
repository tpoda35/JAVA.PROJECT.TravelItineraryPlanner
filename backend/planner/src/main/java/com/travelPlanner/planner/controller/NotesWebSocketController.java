package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.websocket.notes.NoteWsRequestDto;
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
public class NotesWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/trips/{tripId}/notes")
    public void handleNotesMessage(
            @DestinationVariable("tripId") Long tripId,
            @Payload NoteWsRequestDto payload
    ) {
        String logPrefix = "handleNotesMessage";
        log.info("{} :: WebSocket endpoint called. Data: tripId: {}, payload: {}.",logPrefix, tripId, payload);

        switch (payload.getType()) {
            case NOTES_CREATED:
                break;

            case NOTES_UPDATED:
                break;

            case NOTES_DELETED:
                break;

            default:
                log.warn("{} :: Unknown request type: {}.", logPrefix, payload.getType());
        }
    }

}
