package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.websocket.ActivityWsRequestDto;
import com.travelPlanner.planner.dto.websocket.ActivityWsResponseDto;
import com.travelPlanner.planner.service.IActivityWebSocketService;
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
public class ActivityWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final IActivityWebSocketService activityWebSocketService;
    private final ITripCacheService tripCacheService;

    @MessageMapping("/trips/{tripId}/days/{tripDayId}/activities")
    public void handleActivityMessage(
            @DestinationVariable("tripId") Long tripId,
            @DestinationVariable("tripDayId") Long tripDayId,
            @Payload ActivityWsRequestDto payload
    ) {
        String logPrefix = "handleActivityMessage";
        log.info("{} :: WebSocket endpoint called. Data: tripDayId: {}, tripId: {}, payload: {}.",logPrefix, tripDayId, tripId, payload);

        switch (payload.getType()) {
            case ACTIVITY_CREATED:
                ActivityWsResponseDto created = activityWebSocketService.create(payload.getActivityDetailsDtoV3(), tripDayId);
                tripCacheService.evictTripByTripId(tripId);
                messagingTemplate.convertAndSend(
                        "/topic/trips/" + tripId + "/days/" + tripDayId + "/activities",
                        created
                );
                break;

            case ACTIVITY_UPDATED_TITLE:
            case ACTIVITY_UPDATED_DESCRIPTION:
            case ACTIVITY_UPDATED_START_DATE:
            case ACTIVITY_UPDATED_END_DATE:
                ActivityWsResponseDto updated = activityWebSocketService.updateField(payload.getType(), payload.getActivityDetailsDtoV3(), payload.getActivityId());
                tripCacheService.evictTripByTripId(tripId);
                messagingTemplate.convertAndSend("/topic/trips/" + tripId + "/days/" + tripDayId + "/activities", updated);
                break;

            case ACTIVITY_DELETED:
                Long deletedActivityId = payload.getActivityId();

                activityWebSocketService.delete(deletedActivityId);
                tripCacheService.evictTripByTripId(tripId);
                messagingTemplate.convertAndSend(
                        "/topic/trips/" + tripId + "/days/" + tripDayId + "/activities",
                        deletedActivityId
                );
                break;

            default:
                log.warn("{} :: Unknown request type: {}.", logPrefix, payload.getType());
        }
    }
}
