package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.config.settings.FolderSettings;
import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV2;
import com.travelPlanner.planner.exception.AccessDeniedException;
import com.travelPlanner.planner.exception.MaxTripsPerFolderExceededException;
import com.travelPlanner.planner.exception.TripNotFoundException;
import com.travelPlanner.planner.mapper.TripMapper;
import com.travelPlanner.planner.model.*;
import com.travelPlanner.planner.repository.FolderRepository;
import com.travelPlanner.planner.repository.TripDayRepository;
import com.travelPlanner.planner.repository.TripRepository;
import com.travelPlanner.planner.service.*;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static com.travelPlanner.planner.Enum.CollaboratorRole.OWNER;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripService implements ITripService {

    private final IUserService userService;
    private final ITripCacheService tripCacheService;
    private final TransactionTemplate transactionTemplate;
    private final TripRepository tripRepository;
    private final IFolderCacheService folderCacheService;
    private final TripDayRepository tripDayRepository;
    private final ITripPermissionService tripPermissionService;
    private final IFolderPermissionService folderPermissionService;
    private final FolderRepository folderRepository;

    private final FolderSettings folderSettings;

    @Async
    @Override
    public CompletableFuture<TripDetailsDtoV1> getTripById(Long tripId) {
        String logPrefix = "getTripById";
        String loggedInUserId = userService.getUserIdFromContextHolder();

        if (!tripPermissionService.isCollaborator(tripId, loggedInUserId)) {
            denyAccess(logPrefix, tripId, loggedInUserId);
        }

        return CompletableFuture.completedFuture(tripCacheService.getOrLoadTrip(tripId, logPrefix, () ->
                transactionTemplate.execute(status -> {
                    // Load trip without associations to avoid multiple bag fetching
                    Trip trip = tripRepository.findByIdWithTripNotes(tripId)
                            .orElseThrow(() -> {
                                log.info("{} :: Trip not found with the id {}.", logPrefix, tripId);
                                return new TripNotFoundException("Trip not found.");
                            });

                    // Load trip days separately
                    List<TripDay> tripDays = tripDayRepository.findByTripIdWithActivities(tripId);

                    return TripMapper.fromTripToTripDetailsDtoV1(trip, tripDays);
                })
        ));
    }

    @Transactional
    @Override
    public TripDetailsDtoV2 addTripToFolder(@Valid TripCreateDto tripCreateDto) {
        String logPrefix = "addTripToFolder";
        AppUser loggedInUser = userService.getLoggedInUser();
        String loggedInUserId = loggedInUser.getId();
        Long folderId = tripCreateDto.getFolderId();

        // Two db calls may not be optimal.

        // Get folder with validation in single operation
        Folder folder = folderPermissionService.getFolderWithValidation(
                logPrefix, folderId, loggedInUserId);

        if (folderRepository.countTripsByFolderId(folderId) >= folderSettings.getMaxTrips()) {
            log.info("{} :: Max trip ({}) exceeded in Folder with id {}.", logPrefix, folderSettings.getMaxTrips(), folderId);
            throw new MaxTripsPerFolderExceededException(folderSettings.getMaxTrips());
        }

        Trip newTrip = TripMapper.fromTripCreateDtoToTrip(tripCreateDto, folder);

        LocalDate startDate = newTrip.getStartDate();
        LocalDate endDate = newTrip.getEndDate();

        List<TripDay> tripDays = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            TripDay tripDay = TripDay.builder()
                    .date(date)
                    .day(date.getDayOfWeek())
                    .trip(newTrip)
                    .build();

            tripDays.add(tripDay);
        }

        log.debug("{} :: Created {} Day entities for trip from {} to {}.",
                logPrefix, tripDays.size(), startDate, endDate);

        newTrip.setTripDays(tripDays);

        TripCollaborator owner = TripCollaborator.builder()
                .trip(newTrip)
                .collaborator(loggedInUser)
                .role(OWNER)
                .build();
        newTrip.setCollaborators(List.of(owner));

        Trip savedTrip = tripRepository.save(newTrip);
        log.info("{} :: Saved new trip with id {} for userId {}.", logPrefix, savedTrip.getId(), loggedInUserId);

        folderCacheService.evictFoldersByUserId(loggedInUserId);

        return TripMapper.fromTripToTripDetailsDtoV2(savedTrip);
    }

    @Transactional
    @Override
    public TripDetailsDtoV2 renameTrip(Long tripId, String newTripName) {
        String logPrefix = "renameTrip";
        String loggedInUserId = userService.getUserIdFromContextHolder();

        // Get trip with validation
        Trip trip = tripPermissionService.getTripIfOwner(logPrefix, tripId, loggedInUserId);

        trip.setName(newTripName);
        log.info("{} :: Renamed trip with the id {} to {}.", logPrefix, tripId, newTripName);

        tripCacheService.evictTripByTripId(tripId);
        folderCacheService.evictFoldersByUserId(loggedInUserId);

        return TripMapper.fromTripToTripDetailsDtoV2(trip);
    }

    @Transactional
    @Override
    public void deleteTrip(Long tripId) {
        String logPrefix = "deleteTrip";
        String loggedInUserId = userService.getUserIdFromContextHolder();

        if (!tripPermissionService.isOwner(tripId, loggedInUserId)) {
            denyAccess(logPrefix, tripId, loggedInUserId);
        }
        // Direct deletion by ID - more efficient
        tripRepository.deleteById(tripId);

        tripCacheService.evictTripByTripId(tripId);
        folderCacheService.evictFoldersByUserId(loggedInUserId);

        log.info("{} :: Deleted trip with the id {}.", logPrefix, tripId);
    }

    private void denyAccess(String logPrefix, Long tripId, String userId) {
        log.warn("{} :: Unauthorized access attempt on Trip id {} by userId {}.",
                logPrefix, tripId, userId);
        throw new AccessDeniedException("You are not authorized to access this trip.");
    }

}