package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.websocket.activity.ActivityWsRequestDto;
import com.travelPlanner.planner.dto.websocket.activity.ActivityWsResponseDto;
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
            @DestinationVariable Long tripId,
            @DestinationVariable Long tripDayId,
            @Payload ActivityWsRequestDto payload
    ) {
        String logPrefix = "handleActivityMessage";
        log.info("{} :: Received message. tripId={}, tripDayId={}, type={}, activityId={}",
                logPrefix, tripId, tripDayId, payload.getType(), payload.getActivityId());

        ActivityWsResponseDto result = null;

        switch (payload.getType()) {
            case ACTIVITY_CREATED ->
                    result = activityWebSocketService.create(payload.getActivityDetailsDtoV3(), tripDayId);

            case ACTIVITY_UPDATED_TITLE,
                 ACTIVITY_UPDATED_DESCRIPTION,
                 ACTIVITY_UPDATED_START_DATE,
                 ACTIVITY_UPDATED_END_DATE ->
                    result = activityWebSocketService.updateField(
                            payload.getType(),
                            payload.getActivityDetailsDtoV3(),
                            payload.getActivityId()
                    );

            case ACTIVITY_DELETED ->
                    result = activityWebSocketService.delete(payload.getActivityId());

            default -> log.warn("{} :: Unknown request type: {}", logPrefix, payload.getType());
        }

        if (result != null) {
            broadcastActivityChange(tripId, tripDayId, result);
        }
    }

    private void broadcastActivityChange(Long tripId, Long tripDayId, ActivityWsResponseDto activity) {
        tripCacheService.evictTripByTripId(tripId);
        messagingTemplate.convertAndSend(
                "/topic/trips/" + tripId + "/days/" + tripDayId + "/activities",
                activity
        );
    }
}
