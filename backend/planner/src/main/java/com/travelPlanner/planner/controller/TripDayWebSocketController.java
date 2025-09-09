package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.websocket.activity.TripDayWsDto;
import com.travelPlanner.planner.service.IAccommodationWebSocketService;
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
public class TripDayWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ITripCacheService tripCacheService;

    private final IActivityWebSocketService activityWebSocketService;
    private final IAccommodationWebSocketService accommodationWebSocketService;

    @MessageMapping("/trips/{tripId}/days/{tripDayId}")
    public void handleTripDayMessage(
            @DestinationVariable Long tripId,
            @DestinationVariable Long tripDayId,
            @Payload TripDayWsDto payload
    ) {
        String logPrefix = "handleTripDayMessage";
        log.info("{} :: Received message. tripId={}, tripDayId={}, type={}, activityId={}",
                logPrefix, tripId, tripDayId, payload.getType(), payload.getEntityId());

        TripDayWsDto result = null;

        switch (payload.getType()) {
            // Activity
            case ACTIVITY_CREATED ->
                    result = activityWebSocketService.create(payload.getActivity(), tripDayId);

            case ACTIVITY_UPDATED_TITLE,
                 ACTIVITY_UPDATED_DESCRIPTION,
                 ACTIVITY_UPDATED_START_DATE,
                 ACTIVITY_UPDATED_END_DATE ->
                    result = activityWebSocketService.updateField(
                            payload.getType(),
                            payload.getActivity(),
                            payload.getEntityId()
                    );

            case ACTIVITY_DELETED ->
                    result = activityWebSocketService.delete(payload.getEntityId());

            // Accommodation
            case ACCOMMODATION_CREATED ->
                    result = accommodationWebSocketService.create(payload.getAccommodation(), tripDayId);

            case ACCOMMODATION_UPDATED_NAME,
                 ACCOMMODATION_UPDATED_ADDRESS,
                 ACCOMMODATION_UPDATED_CHECK_IN,
                 ACCOMMODATION_UPDATED_CHECK_OUT,
                 ACCOMMODATION_UPDATED_NOTES ->
                    result = accommodationWebSocketService.updateField(
                            payload.getType(),
                            payload.getAccommodation(),
                            payload.getEntityId()
                    );

            case ACCOMMODATION_DELETED ->
                    result = accommodationWebSocketService.delete(payload.getEntityId());

            default -> log.warn("{} :: Unknown request type: {}", logPrefix, payload.getType());
        }

        if (result != null) {
            broadcastChange(tripId, tripDayId, result);
        }
    }

    private void broadcastChange(Long tripId, Long tripDayId, TripDayWsDto response) {
        tripCacheService.evictTripByTripId(tripId);
        messagingTemplate.convertAndSend(
                "/topic/trips/" + tripId + "/days/" + tripDayId,
                response
        );
    }
}
