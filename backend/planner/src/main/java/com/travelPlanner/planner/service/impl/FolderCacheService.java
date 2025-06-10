package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV1;
import com.travelPlanner.planner.exception.FolderNotFoundException;
import com.travelPlanner.planner.service.IFolderCacheService;
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
public class FolderCacheService implements IFolderCacheService {

    private final CacheManager cacheManager;

    private com.github.benmanes.caffeine.cache.Cache<String, List<FolderDetailsDtoV1>> nativeFolderCache;

    @Value("${cache.names.folder}")
    private String folderCacheName;

    @PostConstruct
    public void init() {
        Cache folderCache = cacheManager.getCache(folderCacheName);
        if (folderCache == null) {
            throw new IllegalStateException("Cache '" + folderCacheName + "' not found in CacheManager");
        }

        Object nativeCache = folderCache.getNativeCache();
        if (!(nativeCache instanceof com.github.benmanes.caffeine.cache.Cache)) {
            throw new IllegalStateException("Native cache is not a Caffeine cache");
        }

        nativeFolderCache = (com.github.benmanes.caffeine.cache.Cache<String, List<FolderDetailsDtoV1>>) nativeCache;
    }

    @Override
    public List<FolderDetailsDtoV1> getOrLoadFolders(String logPrefix, String userId, Supplier<List<FolderDetailsDtoV1>> dbLoader) {
        String cacheKey = generateCacheKeyForFoldersCache(userId);

        return nativeFolderCache.get(cacheKey, key -> {
            log.info("{} :: Cache MISS for key '{}'. Loading from DB...", logPrefix, key);

            List<FolderDetailsDtoV1> folders = dbLoader.get();
            if (folders == null || folders.isEmpty()) {
                throw new FolderNotFoundException("No folder(s) found.");
            }

            return folders;
        });
    }

    @Override
    public void evictFoldersByFolderId(String userId) {
        String cacheKey = generateCacheKeyForFoldersCache(userId);

        log.info("Evicting folder cache key '{}'.", cacheKey);
        nativeFolderCache.invalidate(cacheKey);
    }

    private String generateCacheKeyForFoldersCache(String userId) {
        return "userId_" + userId;
    }
}
