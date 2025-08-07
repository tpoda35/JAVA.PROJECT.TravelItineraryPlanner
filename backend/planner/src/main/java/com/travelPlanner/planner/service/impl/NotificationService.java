package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.notification.NotificationPayload;
import com.travelPlanner.planner.mapper.NotificationMapper;
import com.travelPlanner.planner.service.INotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService implements INotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Async
    @Override
    public CompletableFuture<Void> sendToUser(String username, String message) {
        try {
            log.debug("Sending async notification to user: {}", username);

            NotificationPayload payload = NotificationMapper.fromStringToNotificationPayload(message);

            messagingTemplate.convertAndSendToUser(
                    username,
                    "/queue/notifications",
                    payload
            );

            log.info("Notification sent successfully to user: {}", username);
            return CompletableFuture.completedFuture(null);

        } catch (Exception e) {
            log.error("Failed to send notification to user: {}", username, e);
            return CompletableFuture.failedFuture(e);
        }
    }
}
