package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.day.DayDetailsDtoV1;
import com.travelPlanner.planner.model.Day;

import java.util.List;

public class DayMapper {

    public static List<DayDetailsDtoV1> fromDayListToDayDetailsDtoV1List(List<Day> days) {
        return days.stream()
                .map(day -> DayDetailsDtoV1.builder()
                        .id(day.getId())
                        .day(day.getDay())
                        .build())
                .toList();
    }

}
