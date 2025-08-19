package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.repository.TripCollaboratorRepository;
import com.travelPlanner.planner.service.ITripPermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static com.travelPlanner.planner.Enum.CollaboratorRole.OWNER;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripPermissionService implements ITripPermissionService {

    private final TripCollaboratorRepository collaboratorRepository;

    @Override
    public boolean isOwner(Long tripId, String userId) {
        if (tripId == null || userId == null) return false;
        return collaboratorRepository.existsByTripIdAndCollaboratorIdAndRole(tripId, userId, OWNER);
    }

    @Override
    public boolean isCollaborator(Long tripId, String userId) {
        if (tripId == null || userId == null) return false;
        return collaboratorRepository.existsByTripIdAndCollaboratorId(tripId, userId);
    }

    @Override
    public boolean canEdit(Long tripId, String userId) {
        if (tripId == null || userId == null) return false;
        return collaboratorRepository.canEdit(tripId, userId);
    }

    @Override
    public Optional<AppUser> findOwner(Long tripId) {
        return collaboratorRepository.findOwner(tripId);
    }
}
