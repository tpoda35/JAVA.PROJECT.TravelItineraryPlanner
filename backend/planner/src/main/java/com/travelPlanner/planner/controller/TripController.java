package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.day.DayDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV2;
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
        log.info("getTripsByLoggedInUser :: Endpoint called. Data: pageNum: {}, pageSize: {}.", pageNum, pageSize);

        return tripService.getTripsByLoggedInUser(pageNum, pageSize);
    }

    @GetMapping("/{tripId}/days")
    public CompletableFuture<List<DayDetailsDtoV1>> getDaysByTripId(
            @PathVariable("tripId") Long tripId
    ) {
        log.info("getDaysByTripId :: Endpoint called. Data: tripId: {}.", tripId);

        return tripService.getDaysByTripId(tripId);
    }

    @PostMapping
    public TripDetailsDtoV2 addTripToLoggedInUser(
            @RequestBody @Valid TripCreateDto tripCreateDto
    ) {
        log.info("addTripToLoggedInUser :: Endpoint called. Data: tripCreateDto: {}.", tripCreateDto);

        return tripService.addTripToLoggedInUser(tripCreateDto);
    }

    @PatchMapping("/rename/{tripId}")
    public TripDetailsDtoV1 renameTrip(
            @PathVariable("tripId") Long tripId,
            @RequestParam String newTripName
    ) {
        log.info("renameTrip :: Endpoint called. Data: tripId: {}, newTripName: {}.", tripId, newTripName);

        return tripService.renameTrip(tripId, newTripName);
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteTrip(
            @PathVariable("tripId") Long tripId
    ) {
        log.info("deleteTrip :: Endpoint called. Data: tripId: {}.", tripId);

        return tripService.deleteTrip(tripId);
    }
}
