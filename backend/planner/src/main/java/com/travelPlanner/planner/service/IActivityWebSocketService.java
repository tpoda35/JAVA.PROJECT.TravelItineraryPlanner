package com.travelPlanner.planner.service;

import com.travelPlanner.planner.enums.TripDayWsType;
import com.travelPlanner.planner.dto.activity.TripDayActivityDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.activity.TripDayWsDto;

public interface IActivityWebSocketService {
    TripDayWsDto create(TripDayActivityDetailsDtoV3 tripDayActivityDetailsDtoV3, Long tripDayId);
    TripDayWsDto updateField(TripDayWsType type, TripDayActivityDetailsDtoV3 tripDayActivityDetailsDtoV3, Long activityId);
    TripDayWsDto delete(Long activityId);
}
