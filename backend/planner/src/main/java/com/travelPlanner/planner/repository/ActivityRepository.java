package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.TripDayActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<TripDayActivity, Long> {
}
