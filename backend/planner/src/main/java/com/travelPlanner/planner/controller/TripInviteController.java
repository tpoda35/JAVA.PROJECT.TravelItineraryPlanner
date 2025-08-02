package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.invite.InviteWithEmailRequest;
import com.travelPlanner.planner.service.INotificationService;
import com.travelPlanner.planner.service.ITripInviteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities/invite")
@Slf4j
@RequiredArgsConstructor
public class TripInviteController {

    private final ITripInviteService tripInviteService;
    private final INotificationService notificationService;

    @PostMapping("/{tripId}")
    public void inviteWithEmail(
            @PathVariable Long tripId,
            @RequestBody InviteWithEmailRequest request
    ) {
        log.info("inviteWithEmail :: Endpoint called. Data: tripId: {}, InviteWithEmailRequest: {}.", tripId, request);

        String inviterUsername = tripInviteService.inviteWithEmail(tripId, request);
        notificationService.sendToUser(inviterUsername, inviterUsername + "invited you to collaborate in a trip.");
    }

}
