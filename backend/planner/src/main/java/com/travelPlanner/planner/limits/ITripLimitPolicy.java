package com.travelPlanner.planner.limits;

import com.travelPlanner.planner.model.AppUser;

public interface ITripLimitPolicy {
    void checkCanCreateTrip(AppUser appUser, long currentTripCount);
}
