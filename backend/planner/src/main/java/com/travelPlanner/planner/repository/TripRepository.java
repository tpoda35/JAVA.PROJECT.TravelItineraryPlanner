package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    @Query("SELECT CASE WHEN EXISTS(" +
            "SELECT 1 FROM Trip t " +
            "JOIN t.folder f " +
            "JOIN f.appUser u " +
            "WHERE t.id = :tripId AND u.id = :userId" +
            ") THEN true ELSE false END")
    boolean existsByIdAndUserId(@Param("tripId") Long tripId, @Param("userId") String userId);

    @Query("SELECT t FROM Trip t " +
            "JOIN FETCH t.folder f " +
            "JOIN FETCH f.appUser " +
            "WHERE t.id = :tripId")
    Optional<Trip> findByIdWithFolderAndUser(@Param("tripId") Long tripId);

    @Query("SELECT t.id FROM Trip t " +
            "JOIN t.folder f " +
            "JOIN f.appUser u " +
            "WHERE t.id IN :tripIds AND u.id = :userId")
    List<Long> findAuthorizedTripIds(@Param("tripIds") List<Long> tripIds, @Param("userId") String userId);

}
