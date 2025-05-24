package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    Page<Trip> getTripsByAppUser_Id(Pageable pageable, String appUserId);

}
