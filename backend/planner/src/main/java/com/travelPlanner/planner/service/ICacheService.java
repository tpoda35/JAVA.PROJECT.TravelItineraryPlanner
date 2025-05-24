package com.travelPlanner.planner.service;

import com.travelPlanner.planner.model.Trip;
import org.springframework.data.domain.Page;

import java.util.function.Supplier;

public interface ICacheService {
    Page<Trip> getOrLoadTrips(int pageNum, int pageSize, String userId, String logPrefix, Supplier<Page<Trip>> dbLoader);
}
