package com.travelPlanner.planner.service;

import com.travelPlanner.planner.dto.invite.TripInviteDetailsDtoV1;
import org.springframework.data.domain.Page;

import java.util.function.Supplier;

public interface ITripInviteCacheService {
    Page<TripInviteDetailsDtoV1> getOrLoadPendingInvites(
            String userId, String logPrefix, Supplier<Page<TripInviteDetailsDtoV1>> dbLoader, int pageNum, int pageSize
    );
    void evictPendingInvitesByUserId(String userId);
}
