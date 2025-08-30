package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.TripNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripNoteRepository extends JpaRepository<TripNote, Long> {
}
