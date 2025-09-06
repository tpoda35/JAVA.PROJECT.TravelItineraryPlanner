package com.travelPlanner.planner.service;

import com.travelPlanner.planner.Enum.TripDayWsType;
import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.activity.TripDayWsDto;

public interface IActivityWebSocketService {
    TripDayWsDto create(ActivityDetailsDtoV3 activityDetailsDtoV3, Long tripDayId);
    TripDayWsDto updateField(TripDayWsType type, ActivityDetailsDtoV3 activityDetailsDtoV3, Long activityId);
    TripDayWsDto delete(Long activityId);
}
