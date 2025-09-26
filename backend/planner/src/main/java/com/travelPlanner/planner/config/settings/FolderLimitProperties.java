package com.travelPlanner.planner.config.settings;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.limits.folders")
public class FolderLimitProperties {

    private int maxFoldersFree;
    private int maxFoldersPremium;

}
