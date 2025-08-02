package com.travelPlanner.planner.util;

import java.util.UUID;

public class TokenUtil {

    public static String generateInviteToken() {
        return UUID.randomUUID().toString();
    }

}
