package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import org.springframework.data.domain.Page;

import java.util.function.Supplier;

public interface ITripCacheService {
    Page<TripDetailsDtoV1> getOrLoadTrips(int pageNum, int pageSize, String userId, String logPrefix, Supplier<Page<TripDetailsDtoV1>> dbLoader);
    void evictTripsByUserId(String userId);
}
