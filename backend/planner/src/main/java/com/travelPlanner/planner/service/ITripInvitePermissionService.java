package com.travelPlanner.planner.service;

import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.TripInvite;

public interface ITripInvitePermissionService {
    TripInvite validateTripInviteOwnerShip(String logPrefix, Long inviteId, AppUser appUser);
}
