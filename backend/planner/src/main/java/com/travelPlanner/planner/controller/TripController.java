package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.service.ITripService;
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

    private final ITripService tripService;

    @GetMapping
    public CompletableFuture<Page<TripDetailsDtoV1>> getTripsByLoggedInUser(
            @RequestParam(defaultValue = "0") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        log.info("getTripsByLoggedInUser :: Endpoint called.");

        return tripService.getTripsByLoggedInUser(pageNum, pageSize);
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
