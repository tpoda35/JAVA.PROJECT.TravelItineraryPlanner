package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.day.DayDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV2;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface ITripService {

    CompletableFuture<Page<TripDetailsDtoV1>> getTripsByLoggedInUser(int pageNum, int pageSize);
    CompletableFuture<List<DayDetailsDtoV1>> getDaysByTripId(Long tripId);
    TripDetailsDtoV2 addTripToLoggedInUser(TripCreateDto tripCreateDto);
    TripDetailsDtoV1 renameTrip(Long tripId, String newTripName);
    void deleteTrip(Long tripId);

}
