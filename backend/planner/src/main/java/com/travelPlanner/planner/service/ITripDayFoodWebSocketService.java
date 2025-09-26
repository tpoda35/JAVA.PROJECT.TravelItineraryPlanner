package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.food.TripDayFoodDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.activity.TripDayWsDto;
import com.travelPlanner.planner.enums.TripDayWsType;

public interface ITripDayFoodWebSocketService {
    TripDayWsDto create(TripDayFoodDetailsDtoV3 tripDayFoodDetailsDtoV3, Long tripDayId);
    TripDayWsDto updateField(TripDayWsType type, TripDayFoodDetailsDtoV3 tripDayFoodDetailsDtoV3, Long foodId);
    TripDayWsDto delete(Long foodId);
}
