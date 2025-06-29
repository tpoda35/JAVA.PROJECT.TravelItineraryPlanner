package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.service.ITripCacheService;
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
public class TripCacheService implements ITripCacheService {

    private final CacheManager cacheManager;

    private com.github.benmanes.caffeine.cache.Cache<String, TripDetailsDtoV1> nativeTripCache;

    // Caffeine cache for to track user key, because of this we will be able to delete
    // caches per user.
//    private final com.github.benmanes.caffeine.cache.Cache<String, Set<String>> userKeyTracker =
//            com.github.benmanes.caffeine.cache.Caffeine.newBuilder()
//                    .expireAfterWrite(30, TimeUnit.MINUTES)
//                    .maximumSize(600)
//                    .build();

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

        nativeTripCache = (com.github.benmanes.caffeine.cache.Cache<String, TripDetailsDtoV1>) nativeCache;
    }

    @Override
    public TripDetailsDtoV1 getOrLoadTrip(Long tripId, String logPrefix, Supplier<TripDetailsDtoV1> dbLoader) {
        String cacheKey = generateCacheKeyForTripsCache(tripId);

        // This means: "Get the set of keys from the cache with the userId,
        // if none exists, then create a new keySet and store it under the userId,
        // then return the set (either new or existing)."
        // Set<String> keys = userKeyTracker.get(userId, k -> ConcurrentHashMap.newKeySet());
        // keys.add(cacheKey);

        return nativeTripCache.get(cacheKey, key -> {
            log.info("{} :: Cache MISS for key '{}'. Loading from DB...", logPrefix, key);

            return dbLoader.get();
        });
    }

    @Override
    public void evictTripsByTripId(Long tripId) {
        String cacheKey = generateCacheKeyForTripsCache(tripId);

        log.info("Evicting day cache key '{}'.", cacheKey);
        // Maybe add if check
        nativeTripCache.invalidate(cacheKey);
    }

    @Override
    public void evictTripsByTripIds(List<Long> tripIds) {
        for (Long tripId : tripIds) {
            String cacheKey = generateCacheKeyForTripsCache(tripId);
            log.info("Evicting trip cache key '{}'.", cacheKey);
            nativeTripCache.invalidate(cacheKey);
        }
    }

//    @Override
//    public void evictTripsByUserId(String userId) {
//        Set<String> keys = userKeyTracker.getIfPresent(userId);
//        if (keys != null && !keys.isEmpty()) {
//            // Here we delete every key associated with the logged-in user.
//            keys.forEach(k -> {
//                nativeTripCache.invalidate(k);
//                log.info("Evicted trip cache key '{}'", k);
//            });
//            userKeyTracker.invalidate(userId);
//        } else {
//            log.info("No cache keys found for user '{}'. Nothing to evict.", userId);
//        }
//    }

    private String generateCacheKeyForTripsCache(Long tripId) {
        return String.valueOf(tripId);
    }
}

// The commented part is the cache per userId tracker.
