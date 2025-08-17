package com.travelPlanner.planner.service.impl;


import com.travelPlanner.planner.dto.cache.PageCacheEntryDto;
import com.travelPlanner.planner.dto.invite.TripInviteDetailsDtoV1;
import com.travelPlanner.planner.service.ITripCollaboratorCacheService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripCollaboratorCacheService implements ITripCollaboratorCacheService {

    private final CacheManager cacheManager;

    private com.github.benmanes.caffeine.cache.Cache<String, PageCacheEntryDto<TripInviteDetailsDtoV1>> nativeTripInviteCache;

        private final com.github.benmanes.caffeine.cache.Cache<String, Set<String>> userKeyTracker =
            com.github.benmanes.caffeine.cache.Caffeine.newBuilder()
                    .expireAfterWrite(30, TimeUnit.MINUTES)
                    .maximumSize(600)
                    .build();

    @Value("${cache.names.invite}")
    private String tripInviteCacheName;

    @PostConstruct
    public void init() {
        Cache tripInviteCache = cacheManager.getCache(tripInviteCacheName);
        if (tripInviteCache == null) {
            throw new IllegalStateException("Cache '" + tripInviteCacheName + "' not found in CacheManager");
        }

        Object nativeCache = tripInviteCache.getNativeCache();
        if (!(nativeCache instanceof com.github.benmanes.caffeine.cache.Cache)) {
            throw new IllegalStateException("Native cache is not a Caffeine cache");
        }

        nativeTripInviteCache = (com.github.benmanes.caffeine.cache.Cache<String, PageCacheEntryDto<TripInviteDetailsDtoV1>>) nativeCache;
    }

    // Uses a generic custom PageCacheEntryDto, since Page is not good for caching
    // Also uses a separate cache to track the caches more efficiently, it allows to save cache per user
    // Solves the problem that we cannot delete cache per userId, since we cache according to pageNum and Size.
    @Override
    public Page<TripInviteDetailsDtoV1> getOrLoadPendingInvites(
            String userId, String logPrefix, Supplier<Page<TripInviteDetailsDtoV1>> dbLoader, int pageNum, int pageSize
    ) {
        String cacheKey = generateCacheKeyForInvitesCache(userId, pageNum, pageSize);

        Set<String> keys = userKeyTracker.get(userId, k -> ConcurrentHashMap.newKeySet());
        keys.add(cacheKey);

        final boolean[] cacheMiss = {false}; // for race conditions

        PageCacheEntryDto<TripInviteDetailsDtoV1> cached = nativeTripInviteCache.get(cacheKey, key -> {
            cacheMiss[0] = true;
            log.info("{} :: Cache MISS for key '{}'. Loading from DB...", logPrefix, key);

            Page<TripInviteDetailsDtoV1> page = dbLoader.get();

            if (page == null) {
                log.warn("{} :: DB returned null page for key '{}'", logPrefix, key);
                return new PageCacheEntryDto<>(Collections.emptyList(), 0);
            }

            return new PageCacheEntryDto<>(page.getContent(), page.getTotalElements());
        });

        if (!cacheMiss[0]) {
            log.debug("{} :: Cache HIT for key '{}'", logPrefix, cacheKey);
        }

        Pageable pageable = PageRequest.of(pageNum, pageSize);
        return new PageImpl<>(cached.getContent(), pageable, cached.getTotalElements());
    }

    @Override
    public void evictPendingInvitesByUserId(String userId) {
        Set<String> keys = userKeyTracker.getIfPresent(userId);
        if (keys != null && !keys.isEmpty()) {
            // Here we delete every key associated with the logged-in user.
            keys.forEach(k -> {
                nativeTripInviteCache.invalidate(k);
                log.info("Evicted trip invites cache key '{}'", k);
            });
            userKeyTracker.invalidate(userId);
        } else {
            log.info("No cache keys found for user '{}'. Nothing to evict.", userId);
        }
    }

    @Override
    public void evictPendingInvitesByUserIds(List<String> userIds) {
    }

    private String generateCacheKeyForInvitesCache(String userId, int pageNum, int pageSize) {
        return "INVITES_" + userId + "_p" + pageNum + "_s" + pageSize;
    }
}
