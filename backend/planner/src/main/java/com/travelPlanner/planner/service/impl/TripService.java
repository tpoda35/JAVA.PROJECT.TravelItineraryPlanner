package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV2;
import com.travelPlanner.planner.exception.TripNotFoundException;
import com.travelPlanner.planner.mapper.TripMapper;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.Folder;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.model.TripDay;
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
    private final IOwnershipValidationService ownershipValidationService;

    @Async
    @Override
    public CompletableFuture<TripDetailsDtoV1> getTripById(Long tripId) {
        String logPrefix = "getTripById";
        String loggedInUserId = userService.getUserIdFromContextHolder();
        // Fast validation - single query
        ownershipValidationService.validateTripOwnership(logPrefix, tripId, loggedInUserId);

        return CompletableFuture.completedFuture(tripCacheService.getOrLoadTrip(tripId, logPrefix, () ->
                transactionTemplate.execute(status -> {
                    // Load trip without associations since we only validated
                    Trip trip = tripRepository.findById(tripId)
                            .orElseThrow(() -> {
                                log.info("{} :: Trip not found with the id {}.", logPrefix, tripId);
                                return new TripNotFoundException("Trip not found.");
                            });

                    // Load trip days separately to avoid multiple bag fetching
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

        // Get folder with validation in single operation
        Folder folder = ownershipValidationService.getFolderWithValidation(
                logPrefix, tripCreateDto.getFolderId(), loggedInUserId);

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

        // Get trip with validation in single operation
        Trip trip = ownershipValidationService.getTripWithValidation(logPrefix, tripId, loggedInUserId);

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

        // Fast validation - no need to load the entity for deletion
        ownershipValidationService.validateTripOwnership(logPrefix, tripId, loggedInUserId);

        // Direct deletion by ID - more efficient
        tripRepository.deleteById(tripId);

        tripCacheService.evictTripByTripId(tripId);
        folderCacheService.evictFoldersByUserId(loggedInUserId);

        log.info("{} :: Deleted trip with the id {}.", logPrefix, tripId);
    }
}