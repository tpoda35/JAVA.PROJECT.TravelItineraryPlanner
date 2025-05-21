package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/trips")
@Slf4j
@RequiredArgsConstructor
public class TripController {

    @GetMapping
    public CompletableFuture<Page<List<TripDetailsDtoV1>>> getTripsByLoggedInUser() {
        return null;
    }

    @GetMapping("/{tripId}")
    public CompletableFuture<List<TripDetailsDtoV1>> getDaysByTripId(
            @PathVariable("tripId") Long tripId
    ) {
        return null;
    }

    @PostMapping
    public TripDetailsDtoV1 addTripToLoggedInUser(
            @RequestBody @Valid TripCreateDto tripCreateDto
    ) {
        return null;
    }

    @PatchMapping("/rename/{tripId}")
    public TripDetailsDtoV1 renameTrip(
            @PathVariable("tripId") Long tripId
    ) {
        return null;
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteTrip(
            @PathVariable("tripId") Long tripId
    ) {
        return null;
    }

}
