package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.invite.InviteWithEmailRequest;
import com.travelPlanner.planner.dto.invite.TripInviteDetailsDtoV1;
import com.travelPlanner.planner.service.ITripInviteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/trips/invites")
@Slf4j
@RequiredArgsConstructor
public class TripInviteController {

    private final ITripInviteService tripCollaboratorService;

    @PostMapping("/{tripId}")
    public void inviteWithEmail(
            @PathVariable Long tripId,
            @RequestBody InviteWithEmailRequest request
    ) {
        log.info("inviteWithEmail :: Endpoint called. Data: tripId: {}, InviteWithEmailRequest: {}.", tripId, request);

        tripCollaboratorService.inviteWithEmail(tripId, request);
    }

    @GetMapping("/pending")
    public CompletableFuture<Page<TripInviteDetailsDtoV1>> getPendingInvitesByLoggedInUser(
            @RequestParam(defaultValue = "0") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        log.info("getPendingInvitesByLoggedInUser :: Endpoint called.");

        return tripCollaboratorService.getPendingInvitesByLoggedInUser(pageNum, pageSize);
    }

    @PostMapping("/accept/{inviteId}")
    public void acceptInvite(
            @PathVariable("inviteId") Long inviteId
    ) {
        log.info("acceptInvite :: Endpoint called.");

        tripCollaboratorService.acceptInvite(inviteId);
    }

    @PostMapping("/decline/{inviteId}")
    public void declineInvite(
            @PathVariable("inviteId") Long inviteId
    ) {
        log.info("declineInvite :: Endpoint called.");

        tripCollaboratorService.declineInvite(inviteId);
    }
}
