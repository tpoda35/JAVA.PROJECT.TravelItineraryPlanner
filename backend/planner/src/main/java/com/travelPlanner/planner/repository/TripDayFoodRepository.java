package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.TripDayFood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripDayFoodRepository extends JpaRepository<TripDayFood, Long> {
}
