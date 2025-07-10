package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.ActivityWsResponseDto;

public interface IActivityService {
    ActivityWsResponseDto create(ActivityDetailsDtoV3 activityDetailsDtoV3, Long tripDayId);
    ActivityWsResponseDto update(ActivityDetailsDtoV3 activityDetailsDtoV3, Long tripDayId);
    void delete(Long tripDayId);
}
