package com.travelPlanner.planner.config;

import com.travelPlanner.planner.exception.AsyncExceptionHandler;
import com.travelPlanner.planner.exception.GlobalExceptionHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.task.DelegatingSecurityContextAsyncTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@RequiredArgsConstructor
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    private final GlobalExceptionHandler exceptionHandler;

    // Custom async thread pool settings.
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setQueueCapacity(150);
        executor.setMaxPoolSize(4);
        executor.setThreadNamePrefix("AsyncThread-");
        executor.initialize();

        return new DelegatingSecurityContextAsyncTaskExecutor(executor);
    }

    // Exception handler added
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new AsyncExceptionHandler(exceptionHandler);
    }
}
