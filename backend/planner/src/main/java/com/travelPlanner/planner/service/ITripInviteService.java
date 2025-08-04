package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.invite.InviteWithEmailRequest;

public interface ITripInviteService {
    String inviteWithEmail(Long tripId, InviteWithEmailRequest request);
}
