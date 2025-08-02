package com.travelPlanner.planner.service;

import com.travelPlanner.planner.model.AppUser;

public interface IUserService {

    String getUserIdFromContextHolder();
    AppUser getLoggedInUser();
    AppUser getByUsername(String username);

}
