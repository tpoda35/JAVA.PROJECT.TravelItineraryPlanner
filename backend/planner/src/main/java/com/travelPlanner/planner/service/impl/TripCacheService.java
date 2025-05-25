package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.exception.TripNotFoundException;
import com.travelPlanner.planner.service.ITripCacheService;
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
public class TripCacheService implements ITripCacheService {

    private final CacheManager cacheManager;

    private com.github.benmanes.caffeine.cache.Cache<String, Page<TripDetailsDtoV1>> nativeTripCache;

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

        nativeTripCache = (com.github.benmanes.caffeine.cache.Cache<String, Page<TripDetailsDtoV1>>) nativeCache;
    }

    @Override
    public Page<TripDetailsDtoV1> getOrLoadTrips(int pageNum, int pageSize, String userId, String logPrefix, Supplier<Page<TripDetailsDtoV1>> dbLoader) {
        String cacheKey = generateCacheKeyForTripsCache(pageNum, pageSize, userId);

        return nativeTripCache.get(cacheKey, key -> {
            log.info("{} :: Cache MISS for key '{}'. Loading from DB...", logPrefix, key);

            Page<TripDetailsDtoV1> trips = dbLoader.get();
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
