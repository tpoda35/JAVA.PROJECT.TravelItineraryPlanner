package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> getAllByAppUser_Id(String appUserId);

    @Query("SELECT t.id FROM Trip t WHERE t.folder.id = :folderId")
    List<Long> findTripIdsByFolderId(@Param("folderId")Long folderId);
}
