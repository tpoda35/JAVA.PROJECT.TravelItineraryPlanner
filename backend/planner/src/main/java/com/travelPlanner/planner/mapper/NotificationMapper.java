package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.notification.NotificationPayload;

public class NotificationMapper {

    public static NotificationPayload fromStringToNotificationPayload(String message) {
        return NotificationPayload.builder()
                .message(message)
                .build();
    }

}
