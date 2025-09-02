package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.exception.AccessDeniedException;
import com.travelPlanner.planner.exception.TripInviteNotFoundException;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.TripInvite;
import com.travelPlanner.planner.repository.TripInviteRepository;
import com.travelPlanner.planner.service.ITripInvitePermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripInvitePermissionService implements ITripInvitePermissionService {

    private final TripInviteRepository tripInviteRepository;

    private final String inviteEntity = "TripInvite";

    /**
     * Validate trip invite, that the specific user really is the invitee
     * This loads the trip invite with the trip and appUser to avoid multiple sql query
     */
    @Override
    public TripInvite validateTripInviteOwnerShip(String logPrefix, Long inviteId, AppUser appUser) {
        TripInvite tripInvite = tripInviteRepository.findById(inviteId)
                .orElseThrow(() -> {
                    log.info("{} :: Trip Invite not found with the id {}.", logPrefix, inviteId);
                    return new TripInviteNotFoundException("Trip invite not found");
                });
        AppUser invitee = tripInvite.getInvitee();
        if (!invitee.getId().equals(appUser.getId())) {
            logUnauthorizedAccess(logPrefix, tripInvite.getId(), appUser.getId(), inviteEntity);
            throw new AccessDeniedException("You are not authorized to access this trip invite.");
        }

        return tripInvite;
    }

    private void logUnauthorizedAccess(String logPrefix, Long id, String userId, String entity) {
        log.warn("{} :: Unauthorized access attempt on {} id {} by userId {}.",
                logPrefix, entity, id, userId);
    }
}
