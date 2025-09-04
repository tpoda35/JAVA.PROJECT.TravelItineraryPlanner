package com.travelPlanner.planner.config.settings;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.limits.trips")
public class TripLimitProperties {

    private int maxTripsFree;
    private int maxTripsPremium;
}
