package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV3;
import com.travelPlanner.planner.model.TripDay;
import com.travelPlanner.planner.model.TripDayActivity;

public class ActivityMapper {

    public static TripDayActivity fromActivityDetailsDtoV3toActivity(ActivityDetailsDtoV3 activityDetailsDtoV3, TripDay tripDay) {
        return TripDayActivity.builder()
                .title(activityDetailsDtoV3.getTitle())
                .description(activityDetailsDtoV3.getDescription())
                .startDate(activityDetailsDtoV3.getStartDate())
                .endDate(activityDetailsDtoV3.getEndDate())
                .tripDay(tripDay)
                .build();
    }
}
