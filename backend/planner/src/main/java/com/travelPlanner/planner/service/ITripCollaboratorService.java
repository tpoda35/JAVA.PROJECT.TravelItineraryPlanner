package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.invite.InviteWithEmailRequest;
import com.travelPlanner.planner.dto.invite.TripInviteDetailsDtoV1;
import org.springframework.data.domain.Page;

import java.util.concurrent.CompletableFuture;

public interface ITripCollaboratorService {
    void inviteWithEmail(Long tripId, InviteWithEmailRequest request);
    CompletableFuture<Page<TripInviteDetailsDtoV1>> getPendingInvitesByLoggedInUser(int pageNum, int pageSize);
    void acceptInvite(Long inviteId);
    void declineInvite(Long inviteId);
}
