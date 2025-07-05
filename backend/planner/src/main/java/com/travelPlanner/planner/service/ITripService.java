package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV2;

import java.util.concurrent.CompletableFuture;

public interface ITripService {

    CompletableFuture<TripDetailsDtoV1> getTripById(Long tripId);
    TripDetailsDtoV2 addTripToFolder(TripCreateDto tripCreateDto);
    TripDetailsDtoV1 renameTrip(Long tripId, String newTripName);
    void deleteTrip(Long tripId);

}
