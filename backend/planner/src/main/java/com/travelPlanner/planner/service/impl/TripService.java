package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.service.ITripService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripService implements ITripService {


    @Override
    public CompletableFuture<Page<List<TripDetailsDtoV1>>> getTripsByLoggedInUser() {
        return null;
    }

    @Override
    public CompletableFuture<List<TripDetailsDtoV1>> getDaysByTripId(Long tripId) {
        return null;
    }

    @Override
    public TripDetailsDtoV1 addTripToLoggedInUser(TripCreateDto tripCreateDto) {
        return null;
    }

    @Override
    public TripDetailsDtoV1 renameTrip(Long tripId) {
        return null;
    }

    @Override
    public ResponseEntity<Void> deleteTrip(Long tripId) {
        return null;
    }
}
