package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.collaborator.TripCollaboratorDetailsDtoV1;
import org.springframework.data.domain.Page;

import java.util.concurrent.CompletableFuture;

public interface ITripCollaboratorService {
    CompletableFuture<Page<TripCollaboratorDetailsDtoV1>> getTripCollaboratorsByTripId(Long tripId, int pageNum, int pageSize);
}
