package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.invite.InviteWithEmailRequest;
import com.travelPlanner.planner.dto.invite.TripInviteDetailsDtoV1;
import com.travelPlanner.planner.service.ITripCollaboratorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/activities/invite")
@Slf4j
@RequiredArgsConstructor
public class TripCollaborationController {

    private final ITripCollaboratorService tripInviteService;

    @PostMapping("/{tripId}")
    public void inviteWithEmail(
            @PathVariable Long tripId,
            @RequestBody InviteWithEmailRequest request
    ) {
        log.info("inviteWithEmail :: Endpoint called. Data: tripId: {}, InviteWithEmailRequest: {}.", tripId, request);

        tripInviteService.inviteWithEmail(tripId, request);
    }

    @GetMapping("/pending")
    public CompletableFuture<Page<TripInviteDetailsDtoV1>> getPendingInvitesByLoggedInUser(
            @RequestParam(defaultValue = "0") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        log.info("getPendingInvitesByLoggedInUser :: Endpoint called.");

        return tripInviteService.getPendingInvitesByLoggedInUser(pageNum, pageSize);
    }



}
