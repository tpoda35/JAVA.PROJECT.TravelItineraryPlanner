package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.OverviewList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OverviewListRepository extends JpaRepository<OverviewList, Long> {
}
