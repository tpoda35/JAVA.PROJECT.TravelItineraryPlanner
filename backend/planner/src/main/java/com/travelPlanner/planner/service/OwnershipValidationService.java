package com.travelPlanner.planner.service;

import com.travelPlanner.planner.exception.AccessDeniedException;
import com.travelPlanner.planner.exception.FolderNotFoundException;
import com.travelPlanner.planner.exception.TripNotFoundException;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.Folder;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.repository.FolderRepository;
import com.travelPlanner.planner.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class OwnershipValidationService implements IOwnershipValidationService {

    private final TripRepository tripRepository;
    private final FolderRepository folderRepository;

    private final String tripEntity = "Trip";
    private final String folderEntity = "Folder";

    /**
     * Fast trip validation - single query, no entity loading
     */
    public void validateTripOwnership(String logPrefix, Long tripId, String userId) {
        boolean isAuthorized = tripRepository.existsByIdAndUserId(tripId, userId);

        if (!isAuthorized) {
            logUnauthorizedAccess(logPrefix, tripId, userId, tripEntity);
            throw new AccessDeniedException("You are not authorized to access this trip.");
        }
    }

    /**
     * Fast folder validation - single query, no entity loading
     */
    public void validateFolderOwnership(String logPrefix, Long folderId, String userId) {
        boolean isAuthorized = folderRepository.existsByIdAndUserId(folderId, userId);

        if (!isAuthorized) {
            logUnauthorizedAccess(logPrefix, folderId, userId, folderEntity);
            throw new AccessDeniedException("You are not authorized to access this folder.");
        }
    }

    /**
     * Multiple trip validation - single query for multiple trips
     */
    public void validateTripsOwnership(String logPrefix, List<Long> tripIds, String userId) {
        List<Long> authorizedTripIds = tripRepository.findAuthorizedTripIds(tripIds, userId);

        if (authorizedTripIds.size() != tripIds.size()) {
            List<Long> unauthorizedIds = tripIds.stream()
                    .filter(id -> !authorizedTripIds.contains(id))
                    .collect(Collectors.toList());

            log.warn("{} :: Unauthorized access attempt on Trip ids {} by userId {}.",
                    logPrefix, unauthorizedIds, userId);
            throw new AccessDeniedException("You are not authorized to access some trips.");
        }
    }

    /**
     * Get trip with validation in single operation
     * Use when you need the trip entity after validation
     */
    public Trip getTripWithValidation(String logPrefix, Long tripId, String userId) {
        Trip trip = tripRepository.findByIdWithFolderAndUser(tripId)
                .orElseThrow(() -> {
                    log.info("{} :: Trip not found with the id {}.", logPrefix, tripId);
                    return new TripNotFoundException("Trip not found.");
                });

        validateTripOwnershipFromLoadedTrip(logPrefix, trip, userId);
        return trip;
    }

    /**
     * Get folder with validation in single operation
     * * Use when you need the folder entity after validation
     */
    public Folder getFolderWithValidation(String logPrefix, Long folderId, String userId) {
        Folder folder = folderRepository.findByIdWithUser(folderId)
                .orElseThrow(() -> {
                    log.info("{} :: Folder not found with the id {}.", logPrefix, folderId);
                    return new FolderNotFoundException("Folder not found");
                });

        validateFolderOwnershipFromLoadedFolder(logPrefix, folder, userId);
        return folder;
    }

    /**
     * Validate ownership from already loaded trip (no additional queries)
     */
    public void validateTripOwnershipFromLoadedTrip(String logPrefix, Trip trip, String userId) {
        Folder folder = trip.getFolder();
        if (folder == null) {
            log.warn("{} :: Trip id {} has no folder assigned, userId {}.",
                    logPrefix, trip.getId(), userId);
            throw new AccessDeniedException("You are not authorized to access this trip.");
        }

        AppUser appUser = folder.getAppUser();
        if (appUser == null || !userId.equals(appUser.getId())) {
            logUnauthorizedAccess(logPrefix, trip.getId(), userId, tripEntity);
            throw new AccessDeniedException("You are not authorized to access this trip.");
        }
    }

    /**
     * Validate folder ownership from already loaded folder (no additional queries)
     */
    public void validateFolderOwnershipFromLoadedFolder(String logPrefix, Folder folder, String userId) {
        AppUser appUser = folder.getAppUser();
        if (appUser == null || !userId.equals(appUser.getId())) {
            logUnauthorizedAccess(logPrefix, folder.getId(), userId, folderEntity);
            throw new AccessDeniedException("You are not authorized to access this folder.");
        }
    }

    private void logUnauthorizedAccess(String logPrefix,Long id,String userId, String entity) {
        log.warn("{} :: Unauthorized access attempt on {} id {} by userId {}.",
                logPrefix, entity, id, userId);
    }
}