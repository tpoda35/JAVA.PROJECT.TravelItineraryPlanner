package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.TripCollaborator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TripCollaboratorRepository extends JpaRepository<TripCollaborator, Long> {
    Optional<TripCollaborator> findByTripIdAndCollaboratorId(Long tripId, String collaboratorId);
    boolean existsByTripIdAndCollaboratorId(Long trip_id, String collaborator_id);
}
