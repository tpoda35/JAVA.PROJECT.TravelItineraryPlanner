package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.collaborator.TripCollaboratorDetailsDtoV1;
import com.travelPlanner.planner.dto.collaborator.TripCollaboratorRoleUpdateRequest;
import com.travelPlanner.planner.service.ITripCollaboratorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/trips/{tripId}/collaborators")
@Slf4j
@RequiredArgsConstructor
public class TripCollaboratorController {

    private final ITripCollaboratorService collaboratorService;

    @GetMapping
    public CompletableFuture<Page<TripCollaboratorDetailsDtoV1>> getTripCollaboratorsByTripId(
            @PathVariable("tripId") Long tripId,
            @RequestParam(defaultValue = "0") Integer pageNum,
            @RequestParam(defaultValue = "5") Integer pageSize
    ) {
        log.info("getTripCollaboratorsByTripId :: Endpoint called.");

        return collaboratorService.getTripCollaboratorsByTripId(tripId, pageNum, pageSize);
    }

    @DeleteMapping("/{collaboratorId}")
    public ResponseEntity<Void> removeCollaboratorFromTripByUserId(
            @PathVariable("tripId") Long tripId,
            @PathVariable("collaboratorId") Long collaboratorId
    ) {
        log.info("removeCollaboratorFromTripByUserId :: Endpoint called.");

        collaboratorService.removeCollaboratorFromTripByUserId(tripId, collaboratorId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{collaboratorId}/role")
    public TripCollaboratorDetailsDtoV1 updateCollaboratorRole (
            @PathVariable("tripId") Long tripId,
            @PathVariable("collaboratorId") Long collaboratorId,
            @RequestBody TripCollaboratorRoleUpdateRequest tripCollaboratorRoleUpdateRequest
    ) {
        log.info("updateCollaboratorRole :: Endpoint called.");

        return collaboratorService.updateCollaboratorRole(
                tripId, collaboratorId, tripCollaboratorRoleUpdateRequest
        );
    }

}
