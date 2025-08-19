package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> getAllByAppUser_Id(String appUserId);

    @Query("SELECT t.id FROM Trip t WHERE t.folder.id = :folderId")
    List<Long> findTripIdsByFolderId(@Param("folderId")Long folderId);

    // Used for ownershipValidation
    @Query("SELECT COUNT(f) > 0 FROM Folder f " +
            "JOIN f.appUser u " +
            "WHERE f.id = :folderId AND u.id = :userId")
    boolean existsByIdAndUserId(@Param("folderId") Long folderId, @Param("userId") String userId);

    // Used for ownershipValidation
    @Query("SELECT f FROM Folder f " +
            "JOIN FETCH f.appUser " +
            "WHERE f.id = :folderId")
    Optional<Folder> findByIdWithUser(@Param("folderId") Long folderId);
}
