package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.Enum.CollaboratorRole;
import com.travelPlanner.planner.dto.collaborator.TripCollaboratorDetailsDtoV1;
import com.travelPlanner.planner.dto.collaborator.TripCollaboratorRoleUpdateRequest;
import com.travelPlanner.planner.exception.AccessDeniedException;
import com.travelPlanner.planner.exception.TripCollaboratorsNotFoundException;
import com.travelPlanner.planner.mapper.TripCollaboratorMapper;
import com.travelPlanner.planner.model.TripCollaborator;
import com.travelPlanner.planner.repository.TripCollaboratorRepository;
import com.travelPlanner.planner.service.ITripCollaboratorCacheService;
import com.travelPlanner.planner.service.ITripCollaboratorService;
import com.travelPlanner.planner.service.ITripPermissionService;
import com.travelPlanner.planner.service.IUserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

import static com.travelPlanner.planner.Enum.CollaboratorRole.OWNER;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripCollaboratorService implements ITripCollaboratorService {

    private final ITripCollaboratorCacheService collaboratorCacheService;
    private final ITripPermissionService permissionService;
    private final IUserService userService;
    private final TripCollaboratorRepository collaboratorRepository;

    @Async
    @Override
    public CompletableFuture<Page<TripCollaboratorDetailsDtoV1>> getTripCollaboratorsByTripId(Long tripId, int pageNum, int pageSize) {
        String logPrefix = "getTripCollaboratorsByTripId";

        String loggedInUserId = userService.getUserIdFromContextHolder();
        if (!permissionService.isOwner(tripId, loggedInUserId) || !permissionService.isCollaborator(tripId, loggedInUserId)) {
            log.info("{} :: User {} attempted to access collaborators for trip {} without permission.", logPrefix, loggedInUserId, tripId);
            throw new AccessDeniedException("You are not allowed to access this trip");
        }

        return CompletableFuture.completedFuture(collaboratorCacheService.getOrLoadCollaborators(tripId, logPrefix, () -> {
            Page<TripCollaborator> collaborators = collaboratorRepository.findByTripId(tripId, PageRequest.of(pageNum, pageSize));
            if (collaborators.isEmpty()) {
                log.info("{} :: No collaborator(s) found for trip {}.", logPrefix, tripId);
                throw new TripCollaboratorsNotFoundException("No collaborator(s) found.");
            }

            return TripCollaboratorMapper.fromTripCollaboratorPageToDetailsDtoV1(collaborators);
        }, pageNum, pageSize));
    }

    @Transactional
    @Override
    public void removeCollaboratorFromTripByUserId(Long tripId, Long collaboratorId) {
        String logPrefix = "removeCollaboratorFromTripByUserId";
        String loggedInUserId = userService.getUserIdFromContextHolder();

        // Check that the logged-in user is OWNER
        if (!permissionService.isOwner(tripId, loggedInUserId)) {
            log.info("{} :: User {} attempted to kick collaborator for trip {} without permission.", logPrefix, loggedInUserId, tripId);
            throw new AccessDeniedException("You are not allowed to manage this trip.");
        }

        // Prevent removing the owner
        if (permissionService.isOwner(tripId, collaboratorId)) {
            log.info("{} :: Attempt to remove the owner {} from trip {}.", logPrefix, collaboratorId, tripId);
            throw new IllegalArgumentException("You cannot remove the owner from the trip.");
        }

        // Find the collaborator with AppUser eagerly loaded, if everything is right
        TripCollaborator collaborator = collaboratorRepository.findTripCollaboratorById(collaboratorId)
                .orElseThrow(() -> {
                    log.info("{} :: No collaborator found with collaboratorId {}.", logPrefix, collaboratorId);
                    return new TripCollaboratorsNotFoundException("Collaborator not found.");
                });

        collaboratorRepository.delete(collaborator);
        log.info("{} :: Removed collaborator with id {} from trip with id {}.", logPrefix, collaborator, tripId);


        collaboratorCacheService.evictCollaboratorsByTripId(tripId);
    }

    @Transactional
    @Override
    public TripCollaboratorDetailsDtoV1 updateCollaboratorRole(
            Long tripId,
            Long collaboratorId,
            TripCollaboratorRoleUpdateRequest tripCollaboratorRoleUpdateRequest
    ) {
        String logPrefix = "updateCollaboratorRole";
        String loggedInUserId = userService.getUserIdFromContextHolder();

        // 1. Check that the logged-in user is OWNER
        if (!permissionService.isOwner(tripId, loggedInUserId)) {
            log.info("{} :: User {} attempted to update collaborator {} for trip {} without permission.",
                    logPrefix, loggedInUserId, collaboratorId, tripId);
            throw new AccessDeniedException("You are not allowed to manage this trip.");
        }

        // 2. Find the collaborator
        TripCollaborator collaborator = collaboratorRepository.findById(collaboratorId)
                .orElseThrow(() -> {
                    log.info("{} :: No collaborator found with id {}.", logPrefix, collaboratorId);
                    return new TripCollaboratorsNotFoundException("Collaborator not found.");
                });

        // 3. Prevent changing the owner's role
        if (collaborator.getRole() == OWNER) {
            log.info("{} :: Attempt to change role of owner {} in trip {}.", logPrefix, collaboratorId, tripId);
            throw new IllegalArgumentException("You cannot change the role of the trip owner.");
        }

        // 4. Update the collaborator's role
        CollaboratorRole newRole = tripCollaboratorRoleUpdateRequest.getRole();
        collaborator.setRole(newRole);
        collaboratorRepository.save(collaborator);

        log.info("{} :: Updated collaborator {} role to {} in trip {}.",
                logPrefix, collaboratorId, newRole, tripId);

        collaboratorCacheService.evictCollaboratorsByTripId(tripId);

        // 5. Map entity to DTO and return
        return TripCollaboratorMapper.fromTripCollaboratorToDetailsDtoV1(collaborator);
    }
}
