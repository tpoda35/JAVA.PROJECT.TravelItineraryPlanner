package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    @Query("SELECT t FROM Trip t " +
            "LEFT JOIN FETCH t.tripNotes " +
            "WHERE t.id = :tripId")
    Optional<Trip> findByIdWithTripNotes(@Param("tripId") Long tripId);
}
