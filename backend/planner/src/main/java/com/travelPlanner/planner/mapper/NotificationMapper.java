package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.Enum.NotificationType;
import com.travelPlanner.planner.dto.notification.NotificationWrapper;

public class NotificationMapper {

    public static <T> NotificationWrapper<T> createNotification(T content, NotificationType notificationType) {
        return NotificationWrapper.<T>builder()
                .notificationType(notificationType)
                .content(content)
                .build();
    }

}
