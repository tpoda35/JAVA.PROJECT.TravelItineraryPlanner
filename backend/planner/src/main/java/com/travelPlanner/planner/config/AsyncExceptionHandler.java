package com.travelPlanner.planner.config;

import com.travelPlanner.planner.exception.GlobalExceptionHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;

import java.lang.reflect.Method;

@RequiredArgsConstructor
public class AsyncExceptionHandler implements AsyncUncaughtExceptionHandler {

    private final GlobalExceptionHandler exceptionHandler;

    @Override
    public void handleUncaughtException(Throwable ex, Method method, Object... params) {
        exceptionHandler.handleException((Exception) ex);
    }
}
