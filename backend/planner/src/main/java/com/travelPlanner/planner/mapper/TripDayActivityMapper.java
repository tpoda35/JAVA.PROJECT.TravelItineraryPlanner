package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.activity.TripDayActivityDetailsDtoV3;
import com.travelPlanner.planner.model.TripDay;
import com.travelPlanner.planner.model.TripDayActivity;

public class TripDayActivityMapper {

    public static TripDayActivity fromActivityDetailsDtoV3toActivity(TripDayActivityDetailsDtoV3 tripDayActivityDetailsDtoV3, TripDay tripDay) {
        return TripDayActivity.builder()
                .title(tripDayActivityDetailsDtoV3.getTitle())
                .description(tripDayActivityDetailsDtoV3.getDescription())
                .startDate(tripDayActivityDetailsDtoV3.getStartDate())
                .endDate(tripDayActivityDetailsDtoV3.getEndDate())
                .tripDay(tripDay)
                .build();
    }
}
