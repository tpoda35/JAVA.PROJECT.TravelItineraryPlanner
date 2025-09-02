package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.exception.AccessDeniedException;
import com.travelPlanner.planner.exception.TripNotFoundException;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.repository.TripCollaboratorRepository;
import com.travelPlanner.planner.repository.TripRepository;
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
    private final TripRepository tripRepository;

    @Override
    public boolean isOwner(Long tripId, String userId) {
        if (tripId == null || userId == null) return false;
        return collaboratorRepository.existsByTripIdAndCollaboratorIdAndRole(tripId, userId, OWNER);
    }

    @Override
    public boolean isOwner(Long tripId, Long collaboratorId) {
        if (tripId == null || collaboratorId == null) return false;
        return collaboratorRepository.existsByTripIdAndIdAndRole(tripId, collaboratorId, OWNER);
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

    @Override
    public Trip getTripIfCollaborator(String logPrefix, Long tripId, String userId) {
        if (!isCollaborator(tripId, userId)) {
            denyAccess(logPrefix, tripId, userId);
        }

        return findTripById(logPrefix, tripId);
    }

    @Override
    public Trip getTripIfOwner(String logPrefix, Long tripId, String userId) {
        if (!isOwner(tripId, userId)) {
            denyAccess(logPrefix, tripId, userId);
        }

        return findTripById(logPrefix, tripId);
    }

    private Trip findTripById(String logPrefix, Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> {
                    log.info("{} :: Trip not found with the id {}.", logPrefix, tripId);
                    return new TripNotFoundException("Trip not found.");
                });
    }

    private void denyAccess(String logPrefix, Long tripId, String userId) {
        log.warn("{} :: Unauthorized access attempt on Trip id {} by userId {}.",
                logPrefix, tripId, userId);
        throw new AccessDeniedException("You are not authorized to access this trip.");
    }
}
