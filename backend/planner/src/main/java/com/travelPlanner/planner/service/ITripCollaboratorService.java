package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.collaborator.TripCollaboratorDetailsDtoV1;
import com.travelPlanner.planner.dto.collaborator.TripCollaboratorRoleUpdateRequest;
import org.springframework.data.domain.Page;

import java.util.concurrent.CompletableFuture;

public interface ITripCollaboratorService {
    CompletableFuture<Page<TripCollaboratorDetailsDtoV1>> getTripCollaboratorsByTripId(Long tripId, int pageNum, int pageSize);
    void removeCollaboratorFromTripByUserId(Long tripId, Long collaboratorId);
    TripCollaboratorDetailsDtoV1 updateCollaboratorRole(Long tripId, Long collaboratorId, TripCollaboratorRoleUpdateRequest tripCollaboratorRoleUpdateRequest);
}
