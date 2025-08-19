package com.travelPlanner.planner.service;

import com.travelPlanner.planner.model.AppUser;

import java.util.Optional;

public interface ITripPermissionService {
    boolean isOwner(Long tripId, String userId);
    boolean isCollaborator(Long tripId, String userId);
    boolean canEdit(Long tripId, String userId);
    Optional<AppUser> findOwner(Long tripId);
}
