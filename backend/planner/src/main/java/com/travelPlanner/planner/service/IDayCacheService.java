package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.day.DayDetailsDtoV1;

import java.util.List;
import java.util.function.Supplier;

public interface IDayCacheService {

    List<DayDetailsDtoV1> getOrLoadDays(Long tripId, String logPrefix, Supplier<List<DayDetailsDtoV1>> dbLoader);

}
