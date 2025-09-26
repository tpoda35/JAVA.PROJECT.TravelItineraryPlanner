package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.TripDayAccommodation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripDayAccommodationRepository extends JpaRepository<TripDayAccommodation, Long> {

    @Query("SELECT a FROM TripDayAccommodation a WHERE a.tripDay.id IN :tripDayIds")
    List<TripDayAccommodation> findByTripDayIds(@Param("tripDayIds") List<Long> tripDayIds);

}
