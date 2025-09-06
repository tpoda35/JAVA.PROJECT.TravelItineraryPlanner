package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.Enum.TripDayWsType;
import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.activity.TripDayWsDto;
import com.travelPlanner.planner.model.TripDayActivity;

public class TripDayWsMapper {

    public static TripDayWsDto createActivityTripDayWsDto(TripDayWsType type, TripDayActivity tripDayActivity) {
        return TripDayWsDto.builder()
                .type(type)
//                .entityId(tripDayActivity.getId()) this is only used for requests
                .activity(
                        ActivityDetailsDtoV3.builder()
                                .id(tripDayActivity.getId()) // Use this to send back id to the frontend
                                .title(tripDayActivity.getTitle())
                                .description(tripDayActivity.getDescription())
                                .startDate(tripDayActivity.getStartDate())
                                .endDate(tripDayActivity.getEndDate())
                                .build()
                )
                .build();
    }

    public static TripDayWsDto createTripDayWsDto(TripDayWsType type, Long entityId) {
        return TripDayWsDto.builder()
                .type(type)
                .activity(
                        ActivityDetailsDtoV3.builder()
                                .id(entityId)
                                .build()
                )
                .build();
    }

}
