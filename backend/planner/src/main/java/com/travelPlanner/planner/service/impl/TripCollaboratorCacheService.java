package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.cache.PageCacheEntryDto;
import com.travelPlanner.planner.dto.collaborator.TripCollaboratorDetailsDtoV1;
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
import java.util.function.Supplier;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripCollaboratorCacheService implements ITripCollaboratorCacheService {

    private final CacheManager cacheManager;

    private com.github.benmanes.caffeine.cache.Cache<String, PageCacheEntryDto<TripCollaboratorDetailsDtoV1>> nativeTripCollaboratorCache;

    @Value("${cache.names.collaborator}")
    private String tripCollaboratorCacheName;

    @PostConstruct
    public void init() {
        Cache tripCollaboratorCache = cacheManager.getCache(tripCollaboratorCacheName);
        if (tripCollaboratorCache == null) {
            throw new IllegalStateException("Cache '" + tripCollaboratorCacheName + "' not found in CacheManager");
        }

        Object nativeCache = tripCollaboratorCache.getNativeCache();
        if (!(nativeCache instanceof com.github.benmanes.caffeine.cache.Cache)) {
            throw new IllegalStateException("Native cache is not a Caffeine cache");
        }

        nativeTripCollaboratorCache = (com.github.benmanes.caffeine.cache.Cache<String, PageCacheEntryDto<TripCollaboratorDetailsDtoV1>>) nativeCache;
    }

    @Override
    public Page<TripCollaboratorDetailsDtoV1> getOrLoadCollaborators(
            Long tripId, String logPrefix, Supplier<Page<TripCollaboratorDetailsDtoV1>> dbLoader, int pageNum, int pageSize
    ) {
        String cacheKey = generateCacheKeyForCollaboratorsCache(tripId);

        final boolean[] cacheMiss = {false};

        PageCacheEntryDto<TripCollaboratorDetailsDtoV1> cached = nativeTripCollaboratorCache.get(cacheKey, key -> {
            cacheMiss[0] = true;
            log.info("{} :: Cache MISS for key '{}'. Loading from DB...", logPrefix, key);

            Page<TripCollaboratorDetailsDtoV1> page = dbLoader.get();
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
    public void evictCollaboratorsByTripId(Long tripId) {
        String cacheKey = generateCacheKeyForCollaboratorsCache(tripId);
        log.info("Evicting trip cache key '{}'.", cacheKey);
        nativeTripCollaboratorCache.invalidate(cacheKey);
    }

    private String generateCacheKeyForCollaboratorsCache(Long tripId) {
        return "trip_" + tripId;
    }
}
