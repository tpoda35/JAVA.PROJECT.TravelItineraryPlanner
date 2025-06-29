package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;

import java.util.List;
import java.util.function.Supplier;

public interface ITripCacheService {
    TripDetailsDtoV1 getOrLoadTrip(Long tripId, String logPrefix, Supplier<TripDetailsDtoV1> dbLoader);
    void evictTripsByTripId(Long tripId);
    void evictTripsByTripIds(List<Long> tripIds);
}
