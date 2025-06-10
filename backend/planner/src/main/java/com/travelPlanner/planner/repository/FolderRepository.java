package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> getAllByAppUser_Id(String appUserId);
}
