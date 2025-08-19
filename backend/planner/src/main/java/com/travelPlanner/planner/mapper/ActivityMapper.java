package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.Enum.ActivityWsType;
import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV2;
import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.activity.ActivityWsResponseDto;
import com.travelPlanner.planner.model.Activity;
import com.travelPlanner.planner.model.TripDay;

public class ActivityMapper {

    public static Activity fromActivityDetailsDtoV3toActivity(ActivityDetailsDtoV3 activityDetailsDtoV3, TripDay tripDay) {
        return Activity.builder()
                .title(activityDetailsDtoV3.getTitle())
                .description(activityDetailsDtoV3.getDescription())
                .startDate(activityDetailsDtoV3.getStartDate())
                .endDate(activityDetailsDtoV3.getEndDate())
                .tripDay(tripDay)
                .build();
    }

    public static ActivityWsResponseDto createActivityWsResponseDto(ActivityWsType type, Activity activity) {
        return ActivityWsResponseDto.builder()
                .type(type)
                .activityDetailsDtoV2(
                        ActivityDetailsDtoV2.builder()
                                .id(activity.getId())
                                .title(activity.getTitle())
                                .description(activity.getDescription())
                                .startDate(activity.getStartDate())
                                .endDate(activity.getEndDate())
                                .createdAt(activity.getCreatedAt())
                                .updatedAt(activity.getUpdatedAt())
                                .build()
                )
                .build();
    }

    public static ActivityWsResponseDto createActivityWsResponseDto(ActivityWsType type, Long activityId) {
        return ActivityWsResponseDto.builder()
                .type(type)
                .activityDetailsDtoV2(
                        ActivityDetailsDtoV2.builder()
                                .id(activityId)
                                .build()
                )
                .build();
    }

}
