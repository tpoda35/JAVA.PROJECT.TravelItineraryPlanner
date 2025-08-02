package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.notification.NotificationPayload;
import com.travelPlanner.planner.mapper.NotificationMapper;
import com.travelPlanner.planner.service.INotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService implements INotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendToUser(String username, String message) {
        NotificationPayload payload = NotificationMapper.fromStringToNotificationPayload(message);

        messagingTemplate.convertAndSendToUser(
                username,
                "/queue/notifications",
                payload
        );
    }
}
