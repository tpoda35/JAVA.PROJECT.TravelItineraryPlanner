package com.travelPlanner.planner.service;

import com.travelPlanner.planner.enums.NotificationType;

import java.util.concurrent.CompletableFuture;

public interface INotificationService {
    <T> CompletableFuture<Void> sendToUser(String username, T payload, NotificationType notificationType);
}
