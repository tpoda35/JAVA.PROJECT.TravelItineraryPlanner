package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface ITripService {

    CompletableFuture<Page<List<TripDetailsDtoV1>>> getTripsByLoggedInUser();
    CompletableFuture<List<TripDetailsDtoV1>> getDaysByTripId(Long tripId);
    TripDetailsDtoV1 addTripToLoggedInUser(TripCreateDto tripCreateDto);
    TripDetailsDtoV1 renameTrip(Long tripId);
    ResponseEntity<Void> deleteTrip(Long tripId);

}
