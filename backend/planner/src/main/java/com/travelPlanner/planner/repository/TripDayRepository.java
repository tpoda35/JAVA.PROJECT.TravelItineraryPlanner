package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.TripDay;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TripDayRepository extends JpaRepository<TripDay, Long> {

    @EntityGraph(attributePaths = {"activities"})
    @Query("SELECT td FROM TripDay td WHERE td.trip.id = :tripId")
    List<TripDay> findByTripIdWithActivities(@Param("tripId") Long tripId);

    List<TripDay> findByTripIdAndDateBetween(Long tripId, LocalDate date, LocalDate date2);

    @EntityGraph(attributePaths = {"trip"})
    Optional<TripDay> findTripDayById(Long id);

}
