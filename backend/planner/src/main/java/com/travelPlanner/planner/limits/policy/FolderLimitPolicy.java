package com.travelPlanner.planner.limits.policy;

import com.travelPlanner.planner.Enum.SubscriptionPlan;
import com.travelPlanner.planner.config.settings.FolderLimitProperties;
import com.travelPlanner.planner.exception.MaxFoldersPerUserExceededException;
import com.travelPlanner.planner.limits.IFolderLimitPolicy;
import com.travelPlanner.planner.model.AppUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class FolderLimitPolicy implements IFolderLimitPolicy {

    private final Map<SubscriptionPlan, Integer> folderLimits;

    public FolderLimitPolicy(FolderLimitProperties folderLimitProperties) {
        this.folderLimits = new HashMap<>();
        folderLimits.put(SubscriptionPlan.FREE, folderLimitProperties.getMaxFoldersFree());
        folderLimits.put(SubscriptionPlan.PREMIUM, folderLimitProperties.getMaxFoldersPremium());
    }

    @Override
    public void checkCanCreateFolder(AppUser appUser, long currentFolderCount) {
        int maxFolders = folderLimits.getOrDefault(appUser.getSubscriptionPlan(), 0);

        if (currentFolderCount >= maxFolders) {
            log.info("Max folder ({}) exceeded at user {}.", maxFolders, appUser.getId());
            throw new MaxFoldersPerUserExceededException(maxFolders);
        }
    }
}
