package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.food.TripDayFoodDetailsDtoV3;
import com.travelPlanner.planner.enums.TripDayWsType;
import com.travelPlanner.planner.dto.accommodation.TripDayAccommodationDetailsDtoV3;
import com.travelPlanner.planner.dto.activity.TripDayActivityDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.activity.TripDayWsDto;
import com.travelPlanner.planner.model.TripDayAccommodation;
import com.travelPlanner.planner.model.TripDayActivity;
import com.travelPlanner.planner.model.TripDayFood;

public class TripDayWsMapper {

    public static TripDayWsDto createActivityTripDayWsDto(TripDayWsType type, TripDayActivity tripDayActivity) {
        // Activities
        return TripDayWsDto.builder()
                .type(type)
//                .entityId(tripDayActivity.getId()) this is only used for requests
                .activity(
                        TripDayActivityDetailsDtoV3.builder()
                                .id(tripDayActivity.getId()) // Use this to send back id to the frontend
                                .title(tripDayActivity.getTitle())
                                .description(tripDayActivity.getDescription())
                                .startDate(tripDayActivity.getStartDate())
                                .endDate(tripDayActivity.getEndDate())
                                .build()
                )
                .build();
    }

    public static TripDayWsDto createDeleteActivityTripDayWsDto(TripDayWsType type, Long activityId) {
        return TripDayWsDto.builder()
                .type(type)
                .activity(
                        TripDayActivityDetailsDtoV3.builder()
                                .id(activityId)
                                .build()
                )
                .build();
    }

    // Accommodations
    public static TripDayWsDto createAccommodationTripDayWsDto(TripDayWsType type, TripDayAccommodation tripDayAccommodation) {
        return TripDayWsDto.builder()
                .type(type)
                .accommodation(
                        TripDayAccommodationDetailsDtoV3.builder()
                                .id(tripDayAccommodation.getId())
                                .name(tripDayAccommodation.getName())
                                .address(tripDayAccommodation.getAddress())
                                .checkIn(tripDayAccommodation.getCheckIn())
                                .checkOut(tripDayAccommodation.getCheckOut())
                                .notes(tripDayAccommodation.getNotes())
                                .build()
                )
                .build();
    }

    public static TripDayWsDto createDeleteAccommodationTripDayWsDto(TripDayWsType type, Long accommodationId) {
        return TripDayWsDto.builder()
                .type(type)
                .accommodation(
                        TripDayAccommodationDetailsDtoV3.builder()
                                .id(accommodationId)
                                .build()
                )
                .build();
    }

    // Foods
    public static TripDayWsDto createFoodTripDayWsDto(TripDayWsType type, TripDayFood tripDayFood) {
        return TripDayWsDto.builder()
                .type(type)
                .food(
                        TripDayFoodDetailsDtoV3.builder()
                                .id(tripDayFood.getId())
                                .name(tripDayFood.getName())
                                .startDate(tripDayFood.getStartDate())
                                .endDate(tripDayFood.getEndDate())
                                .notes(tripDayFood.getNotes())
                                .location(tripDayFood.getLocation())
                                .mealType(tripDayFood.getMealType())
                                .build()
                )
                .build();
    }

}
