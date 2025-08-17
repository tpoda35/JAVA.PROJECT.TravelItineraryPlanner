package com.travelPlanner.planner.service;

import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.Folder;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.model.TripInvite;

import java.util.List;

public interface IOwnershipValidationService {
    void validateTripOwnership(String logPrefix, Long tripId, String userId);
    void validateFolderOwnership(String logPrefix, Long folderId, String userId);
    void validateTripsOwnership(String logPrefix, List<Long> tripIds, String userId);
    Trip getTripWithValidation(String logPrefix, Long tripId, String userId);
    Folder getFolderWithValidation(String logPrefix, Long folderId, String userId);
    void validateTripOwnershipFromLoadedTrip(String logPrefix, Trip trip, String userId);
    void validateFolderOwnershipFromLoadedFolder(String logPrefix, Folder folder, String userId);
    TripInvite validateTripInviteOwnerShip(String logPrefix, Long inviteId, AppUser appUser);
}
