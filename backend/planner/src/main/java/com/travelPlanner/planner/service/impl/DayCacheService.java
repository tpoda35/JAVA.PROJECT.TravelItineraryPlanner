package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.day.DayDetailsDtoV1;
import com.travelPlanner.planner.exception.DayNotFoundException;
import com.travelPlanner.planner.service.IDayCacheService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Supplier;

@Service
@RequiredArgsConstructor
@Slf4j
public class DayCacheService implements IDayCacheService {

    private final CacheManager cacheManager;

    private com.github.benmanes.caffeine.cache.Cache<String, List<DayDetailsDtoV1>> nativeDayCache;

    @Value("${cache.names.day}")
    private String dayCacheName;

    @PostConstruct
    public void init() {
        Cache dayCache = cacheManager.getCache(dayCacheName);
        if (dayCache == null) {
            throw new IllegalStateException("Cache '" + dayCacheName + "' not found in CacheManager");
        }

        Object nativeCache = dayCache.getNativeCache();
        if (!(nativeCache instanceof com.github.benmanes.caffeine.cache.Cache)) {
            throw new IllegalStateException("Native cache is not a Caffeine cache");
        }

        nativeDayCache = (com.github.benmanes.caffeine.cache.Cache<String, List<DayDetailsDtoV1>>) nativeCache;
    }

    @Override
    public List<DayDetailsDtoV1> getOrLoadDays(Long tripId, String logPrefix, Supplier<List<DayDetailsDtoV1>> dbLoader) {
        String cacheKey = generateCacheKeyForDaysCache(tripId);

        return nativeDayCache.get(cacheKey, key -> {
            log.info("{} :: Cache MISS for key '{}'. Loading from DB...", logPrefix, key);

            List<DayDetailsDtoV1> days = dbLoader.get();
            if (days == null || days.isEmpty()) {
                throw new DayNotFoundException("No day(s) found,.");
            }

            return days;
        });
    }

    private String generateCacheKeyForDaysCache(Long tripId) {
        return String.valueOf(tripId);
    }
}
