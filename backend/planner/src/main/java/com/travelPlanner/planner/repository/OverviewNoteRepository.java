package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.OverviewNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OverviewNoteRepository extends JpaRepository<OverviewNote, Long> {
}
