package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.websocket.note.OverviewWsDto;
import com.travelPlanner.planner.service.IOverviewListWebSocketService;
import com.travelPlanner.planner.service.IOverviewNoteWebSocketService;
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
public class OverviewWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ITripCacheService tripCacheService;

    private final IOverviewNoteWebSocketService noteWebSocketService;
    private final IOverviewListWebSocketService listWebSocketService;

    @MessageMapping("/trips/{tripId}/overview/{overviewId}")
    public void handleOverviewMessage(
            @DestinationVariable Long tripId,
            @DestinationVariable Long overviewId,
            @Payload OverviewWsDto payload
    ) {
        String logPrefix = "handleOverviewMessage";
        log.info("{} :: Received message. tripId: {}, overviewId: {}, payload: {}", logPrefix, tripId, overviewId, payload);

        OverviewWsDto result = null;
        switch (payload.getType()) {
            // Note
            case NOTE_CREATED ->
                    result = noteWebSocketService.create(overviewId);

            case NOTE_UPDATED_CONTENT ->
                    result = noteWebSocketService.update(
                            payload.getEntityId(),
                            payload.getNote()
                    );

            case NOTE_DELETED ->
                    result = noteWebSocketService.delete(payload.getEntityId());

            // List
            case LIST_CREATED ->
                result = listWebSocketService.create(overviewId);

            case LIST_UPDATED_TITLE ->
                result = listWebSocketService.update(
                        payload.getEntityId(),
                        payload.getList()
                );

            case LIST_DELETED ->
                result = listWebSocketService.delete(payload.getEntityId());

            // List item
            case LIST_ITEM_CREATED -> {
            }
            case LIST_ITEM_UPDATED_CONTENT -> {
            }
            case LIST_ITEM_DELETED -> {
            }

            default -> log.warn("{} :: Unknown request type: {}", logPrefix, payload.getType());
        }

        if (result != null) {
            broadcastChange(tripId, result);
        }
    }

    private void broadcastChange(Long tripId, OverviewWsDto result) {
        tripCacheService.evictTripByTripId(tripId);
        messagingTemplate.convertAndSend("/topic/trips/" + tripId,
                result
        );
    }
}
