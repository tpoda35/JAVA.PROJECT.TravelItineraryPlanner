package com.travelPlanner.planner.service;

import java.util.concurrent.CompletableFuture;

public interface INotificationService {
    CompletableFuture<Void> sendToUser(String username, String message);
}
