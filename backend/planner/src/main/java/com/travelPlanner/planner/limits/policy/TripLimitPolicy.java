package com.travelPlanner.planner.limits.policy;

import com.travelPlanner.planner.enums.SubscriptionPlan;
import com.travelPlanner.planner.config.settings.TripLimitProperties;
import com.travelPlanner.planner.exception.MaxTripsPerFolderExceededException;
import com.travelPlanner.planner.limits.ITripLimitPolicy;
import com.travelPlanner.planner.model.AppUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class TripLimitPolicy implements ITripLimitPolicy {

    private final Map<SubscriptionPlan, Integer> tripLimits;

    public TripLimitPolicy(TripLimitProperties tripLimitProperties) {
        this.tripLimits = new HashMap<>();
        tripLimits.put(SubscriptionPlan.FREE, tripLimitProperties.getMaxTripsFree());
        tripLimits.put(SubscriptionPlan.PREMIUM, tripLimitProperties.getMaxTripsPremium());
    }

    @Override
    public void checkCanCreateTrip(AppUser appUser, long currentTripCount) {
        int maxTrips = tripLimits.getOrDefault(appUser.getSubscriptionPlan(), 0);

        if (currentTripCount >= maxTrips) {
            log.info("Max trip ({}) exceeded in Folder, userId: {}.", maxTrips, appUser.getId());
            throw new MaxTripsPerFolderExceededException(maxTrips);
        }
    }
}
