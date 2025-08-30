package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.collaborator.TripCollaboratorDetailsDtoV1;
import com.travelPlanner.planner.exception.AccessDeniedException;
import com.travelPlanner.planner.exception.TripCollaboratorsNotFoundException;
import com.travelPlanner.planner.mapper.TripCollaboratorMapper;
import com.travelPlanner.planner.model.TripCollaborator;
import com.travelPlanner.planner.repository.TripCollaboratorRepository;
import com.travelPlanner.planner.service.ITripCollaboratorCacheService;
import com.travelPlanner.planner.service.ITripCollaboratorService;
import com.travelPlanner.planner.service.ITripPermissionService;
import com.travelPlanner.planner.service.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

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
        if (!permissionService.isCollaborator(tripId, loggedInUserId)) {
            log.info("{} :: User {} attempted to access collaborators for trip {} without permission.", logPrefix, tripId, loggedInUserId);
            throw new AccessDeniedException("User is not allowed to access this trip");
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
}
