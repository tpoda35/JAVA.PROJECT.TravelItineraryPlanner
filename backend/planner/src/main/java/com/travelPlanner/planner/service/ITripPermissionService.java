package com.travelPlanner.planner.service;

import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.Trip;

import java.util.Optional;

public interface ITripPermissionService {
    boolean isOwner(Long tripId, String userId);
    boolean isOwner(Long tripId, Long collaboratorId);
    boolean isCollaborator(Long tripId, String userId);
    boolean canEdit(Long tripId, String userId);
    Optional<AppUser> findOwner(Long tripId);

    Trip getTripIfCollaborator(String logPrefix, Long tripId, String userId);
    Trip getTripIfOwner(String logPrefix, Long tripId, String userId);
}
