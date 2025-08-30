package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.Enum.CollaboratorRole;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.TripCollaborator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TripCollaboratorRepository extends JpaRepository<TripCollaborator, Long> {
    Optional<TripCollaborator> findByTripIdAndCollaboratorId(Long tripId, String collaboratorId);
    boolean existsByTripIdAndCollaboratorId(Long tripId, String collaboratorId);

    @Query("SELECT CASE WHEN COUNT(tc) > 0 THEN true ELSE false END " +
            "FROM TripCollaborator tc " +
            "WHERE tc.trip.id = :tripId " +
            "AND tc.collaborator.id = :userId " +
            "AND tc.role = :role")
    boolean existsByTripIdAndCollaboratorIdAndRole(@Param("tripId") Long tripId,
                                                   @Param("userId") String userId,
                                                   @Param("role") CollaboratorRole role);

    @Query("SELECT CASE WHEN COUNT(tc) > 0 THEN true ELSE false END " +
            "FROM TripCollaborator tc " +
            "WHERE tc.trip.id = :tripId " +
            "AND tc.collaborator.id = :userId " +
            "AND (tc.role = 'OWNER' OR tc.role = 'EDITOR')")
    boolean canEdit(@Param("tripId") Long tripId,
                    @Param("userId") String userId);

    @Query("SELECT tc.collaborator " +
            "FROM TripCollaborator tc " +
            "WHERE tc.trip.id = :tripId " +
            "AND tc.role = 'OWNER'")
    Optional<AppUser> findOwner(@Param("tripId") Long tripId);

    @EntityGraph(attributePaths = {"collaborator"})
    Page<TripCollaborator> findByTripId(Long tripId, Pageable pageable);
}
