package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.accommodation.TripDayAccommodationDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.activity.TripDayWsDto;
import com.travelPlanner.planner.enums.TripDayWsType;

public interface ITripDayAccommodationWebSocketService {
    TripDayWsDto create(TripDayAccommodationDetailsDtoV3 tripDayAccommodationDetailsDtoV3, Long tripDayId);
    TripDayWsDto updateField(TripDayWsType type, TripDayAccommodationDetailsDtoV3 tripDayAccommodationDetailsDtoV3, Long accommodationId);
    TripDayWsDto delete(Long accommodationId);
}
