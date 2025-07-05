package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV2;
import com.travelPlanner.planner.service.ITripService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/trips")
@Slf4j
@RequiredArgsConstructor
public class TripController {

    private final ITripService tripService;

    @GetMapping("/{tripId}")
    public CompletableFuture<TripDetailsDtoV1> getTripById(
            @PathVariable("tripId") Long tripId
    ) {
        log.info("getTripsByLoggedInUser :: Endpoint called. Data: tripId: {}.", tripId);

        return tripService.getTripById(tripId);
    }

    @PostMapping
    public ResponseEntity<TripDetailsDtoV2> addTripToFolder(
            @RequestBody @Valid TripCreateDto tripCreateDto
    ) {
        log.info("addTripToFolder :: Endpoint called. Data: tripCreateDto: {}.", tripCreateDto);

        TripDetailsDtoV2 savedTrip = tripService.addTripToFolder(tripCreateDto);
        URI location = URI.create("/trips/" + savedTrip.getId());

        return ResponseEntity.created(location).body(savedTrip);
    }

    @PatchMapping("/rename/{tripId}")
    public TripDetailsDtoV1 renameTrip(
            @PathVariable("tripId") Long tripId,
            @RequestParam @NotBlank(message = "Trip name cannot be blank.") String newTripName
    ) {
        log.info("renameTrip :: Endpoint called. Data: tripId: {}, newTripName: {}.", tripId, newTripName);

        return tripService.renameTrip(tripId, newTripName);
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteTrip(
            @PathVariable("tripId") Long tripId
    ) {
        log.info("deleteTrip :: Endpoint called. Data: tripId: {}.", tripId);
        tripService.deleteTrip(tripId);

        return ResponseEntity.noContent().build();
    }
}
