package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.Trip;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    @EntityGraph(attributePaths = {
            "tripDays",
            "tripDays.activities"
    })
    Optional<Trip> findWithDetailsById(Long id);
}
