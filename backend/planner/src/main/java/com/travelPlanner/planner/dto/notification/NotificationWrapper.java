package com.travelPlanner.planner.dto.notification;

import com.travelPlanner.planner.Enum.NotificationType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationWrapper<T> {

    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;
    private T content;

}
