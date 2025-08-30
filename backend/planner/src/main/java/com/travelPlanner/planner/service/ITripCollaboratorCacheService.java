package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.collaborator.TripCollaboratorDetailsDtoV1;
import org.springframework.data.domain.Page;

import java.util.function.Supplier;

public interface ITripCollaboratorCacheService {
    Page<TripCollaboratorDetailsDtoV1> getOrLoadCollaborators(
            Long tripId, String logPrefix, Supplier<Page<TripCollaboratorDetailsDtoV1>> dbLoader, int pageNum, int pageSize
    );
    void evictCollaboratorsByTripId(Long tripId, int pageNum, int pageSize);
}
