package com.travelPlanner.planner.service;

import java.util.Map;

public interface IAuthService {

    Map<String, Object> getToken(String username, String password);

}
