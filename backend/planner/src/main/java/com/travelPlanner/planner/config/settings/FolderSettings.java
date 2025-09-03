package com.travelPlanner.planner.config.settings;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.settings.folder")
public class FolderSettings {

    private int maxTrips;

}
