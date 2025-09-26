package com.travelPlanner.planner.limits;

import com.travelPlanner.planner.model.AppUser;

public interface IFolderLimitPolicy {
    void checkCanCreateFolder(AppUser appUser, long currentFolderCount);
}
