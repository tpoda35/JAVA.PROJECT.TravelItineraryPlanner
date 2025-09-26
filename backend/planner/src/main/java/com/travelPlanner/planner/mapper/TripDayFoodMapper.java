package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.food.TripDayFoodDetailsDtoV3;
import com.travelPlanner.planner.model.TripDay;
import com.travelPlanner.planner.model.TripDayFood;

public class TripDayFoodMapper {

    public static TripDayFood fromDetailsDtoV3ToTripDayFood(TripDayFoodDetailsDtoV3 tripDayFoodDetailsDtoV3, TripDay tripDay) {
        return TripDayFood.builder()
                .name(tripDayFoodDetailsDtoV3.getName())
                .startDate(tripDayFoodDetailsDtoV3.getStartDate())
                .endDate(tripDayFoodDetailsDtoV3.getEndDate())
                .notes(tripDayFoodDetailsDtoV3.getNotes())
                .location(tripDayFoodDetailsDtoV3.getLocation())
                .mealType(tripDayFoodDetailsDtoV3.getMealType())
                .tripDay(tripDay)
                .build();
    }

}
