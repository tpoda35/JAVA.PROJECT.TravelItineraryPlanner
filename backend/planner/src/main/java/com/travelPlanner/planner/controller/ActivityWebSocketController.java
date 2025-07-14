package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.websocket.ActivityWsRequestDto;
import com.travelPlanner.planner.dto.websocket.ActivityWsResponseDto;
import com.travelPlanner.planner.service.IActivityService;
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
    private final IActivityService activityService;
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
                ActivityWsResponseDto created = activityService.create(payload.getActivityDetailsDtoV3(), tripDayId);
                tripCacheService.evictTripByTripId(tripId);
                messagingTemplate.convertAndSend(
                        "/topic/trips/" + tripId + "/days/" + tripDayId + "/activities",
                        created
                );
                break;

            case ACTIVITY_UPDATED:
                ActivityWsResponseDto updated = activityService.update(payload.getActivityDetailsDtoV3(), tripDayId);
                tripCacheService.evictTripByTripId(tripId);
                messagingTemplate.convertAndSend(
                        "/topic/trips/" + tripId + "/days/" + tripDayId + "/activities",
                        updated
                );
                break;

            case ACTIVITY_DELETED:
                activityService.delete(payload.getActivityId());
                messagingTemplate.convertAndSend(
                        "/topic/trips/" + tripId + "/days/" + tripDayId + "/activities"
                );
                break;

            default:
                log.warn("{} :: Unknown request type: {}.", logPrefix, payload.getType());
        }
    }
}
