package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.TripDayFood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripDayFoodRepository extends JpaRepository<TripDayFood, Long> {

    @Query("SELECT f FROM TripDayFood f WHERE f.tripDay.id IN :tripDayIds")
    List<TripDayFood> findByTripDayIds(@Param("tripDayIds") List<Long> tripDayIds);

}
