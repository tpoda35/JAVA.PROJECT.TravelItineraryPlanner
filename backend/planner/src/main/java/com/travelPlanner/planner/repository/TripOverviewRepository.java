package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.TripOverview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripOverviewRepository extends JpaRepository<TripOverview, Long> {
}
