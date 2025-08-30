package com.travelPlanner.planner.service;

import com.travelPlanner.planner.Enum.ActivityWsType;
import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.activity.ActivityWsResponseDto;

public interface IActivityWebSocketService {
    ActivityWsResponseDto create(ActivityDetailsDtoV3 activityDetailsDtoV3, Long tripDayId);
    ActivityWsResponseDto updateField(ActivityWsType type, ActivityDetailsDtoV3 activityDetailsDtoV3, Long activityId);
    ActivityWsResponseDto delete(Long activityId);
}
