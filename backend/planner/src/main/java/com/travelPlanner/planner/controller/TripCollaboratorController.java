package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.collaborator.TripCollaboratorDetailsDtoV1;
import com.travelPlanner.planner.service.ITripCollaboratorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/trips/collaborators")
@Slf4j
@RequiredArgsConstructor
public class TripCollaboratorController {

    private final ITripCollaboratorService collaboratorService;

    @GetMapping("/{tripId}")
    public CompletableFuture<Page<TripCollaboratorDetailsDtoV1>> getTripCollaboratorsByTripId(
            @PathVariable("tripId") Long tripId,
            @RequestParam(defaultValue = "0") Integer pageNum,
            @RequestParam(defaultValue = "5") Integer pageSize
    ) {
        log.info("getTripCollaboratorsByTripId :: Endpoint called.");

        return collaboratorService.getTripCollaboratorsByTripId(tripId, pageNum, pageSize);
    }

}
