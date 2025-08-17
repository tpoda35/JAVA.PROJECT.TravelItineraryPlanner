package com.travelPlanner.planner.repository;

import com.travelPlanner.planner.Enum.InviteStatus;
import com.travelPlanner.planner.model.TripInvite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TripInviteRepository extends JpaRepository<TripInvite, Long> {

    Page<TripInvite> findByInviteeIdAndStatus(String inviteeId, InviteStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"invitee", "trip"})
    Optional<TripInvite> findById(Long inviteId);

}
