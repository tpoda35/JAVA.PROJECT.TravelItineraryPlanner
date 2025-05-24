package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.exception.TripNotFoundException;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.service.ICacheService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.function.Supplier;

@Service
@RequiredArgsConstructor
@Slf4j
public class CacheService implements ICacheService {

    private final CacheManager cacheManager;

    private com.github.benmanes.caffeine.cache.Cache<String, Page<Trip>> nativeTripCache;

    @Value("${cache.names.trip}")
    private String tripCacheName;

    @PostConstruct
    public void init() {
        Cache tripCache = cacheManager.getCache(tripCacheName);
        if (tripCache == null) {
            throw new IllegalStateException("Cache '" + tripCacheName + "' not found in CacheManager");
        }

        Object nativeCache = tripCache.getNativeCache();
        if (!(nativeCache instanceof com.github.benmanes.caffeine.cache.Cache)) {
            throw new IllegalStateException("Native cache is not a Caffeine cache");
        }

        nativeTripCache = (com.github.benmanes.caffeine.cache.Cache<String, Page<Trip>>) nativeCache;
    }

    @Override
    public Page<Trip> getOrLoadTrips(int pageNum, int pageSize, String userId, String logPrefix, Supplier<Page<Trip>> dbLoader) {
        String cacheKey = generateCacheKeyForTripsCache(pageNum, pageSize, userId);

        return nativeTripCache.get(cacheKey, key -> {
            log.info("{} :: Cache MISS for key '{}'. Loading from DB...", logPrefix, key);

            Page<Trip> trips = dbLoader.get();
            if (trips == null || trips.isEmpty()) {
                throw new TripNotFoundException("No trip(s) found.");
            }

            return trips;
        });
    }

    private String generateCacheKeyForTripsCache(int pageNum, int pageSize, String userId) {
        return userId + ":" + pageNum + ":" + pageSize;
    }
}
