package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<AppUser, String> {
    Optional<AppUser> findByUsername(String email);

    @Query("SELECT COUNT(f) FROM AppUser u JOIN u.folders f WHERE u.id = :userId")
    long countFoldersByUserId(@Param("userId") String userId);
}
