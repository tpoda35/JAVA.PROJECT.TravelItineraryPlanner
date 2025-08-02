package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.TripInvite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripInviteRepository extends JpaRepository<TripInvite, Long> {
}
