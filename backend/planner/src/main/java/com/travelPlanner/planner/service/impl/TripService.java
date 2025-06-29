package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.day.DayDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV2;
import com.travelPlanner.planner.exception.AccessDeniedException;
import com.travelPlanner.planner.exception.FolderNotFoundException;
import com.travelPlanner.planner.exception.TripNotFoundException;
import com.travelPlanner.planner.mapper.DayMapper;
import com.travelPlanner.planner.mapper.TripMapper;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.TripDay;
import com.travelPlanner.planner.model.Folder;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.repository.FolderRepository;
import com.travelPlanner.planner.repository.TripRepository;
import com.travelPlanner.planner.service.*;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
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
    private final IDayCacheService dayCacheService;
    private final TransactionTemplate transactionTemplate;
    private final TripRepository tripRepository;
    private final FolderRepository folderRepository;
    private final IFolderCacheService folderCacheService;

    @Async
    @Override
    public CompletableFuture<TripDetailsDtoV1> getTripById(Long tripId) {
        String logPrefix = "getTripById";

        return CompletableFuture.completedFuture(tripCacheService.getOrLoadTrip(tripId, logPrefix, () ->
                transactionTemplate.execute(status -> {
                    Trip trip = findTripById(logPrefix, tripId);

                    Hibernate.initialize(trip.getTripDays());

                    return TripMapper.fromTripToTripDetailsDtoV1(trip);
                })
        ));
    }

    // Not used
    @Async
    @Override
    public CompletableFuture<List<DayDetailsDtoV1>> getDaysByTripId(Long tripId) {
        String logPrefix = "getDaysByTripId";

        return CompletableFuture.completedFuture(dayCacheService.getOrLoadDays(tripId, logPrefix, () ->
                transactionTemplate.execute(status -> {
                    List<TripDay> tripDays = tripRepository.findById(tripId)
                            .orElseThrow(() -> new TripNotFoundException("Trip not found."))
                            .getTripDays();

                    return DayMapper.fromDayListToDayDetailsDtoV1List(tripDays);
                })
        ));
    }

    @Transactional
    @Override
    public TripDetailsDtoV2 addTripToFolder(@Valid TripCreateDto tripCreateDto) {
        String logPrefix = "addTripToFolder";

        Folder folder = findFolderById(logPrefix, tripCreateDto.getFolderId());

        AppUser loggedInUser = userService.getLoggedInUser();
        String loggedInUserId = loggedInUser.getId();

        validateFolderOwnership(logPrefix, folder, loggedInUserId);

        Trip newTrip = TripMapper.fromTripCreateDtoToTrip(tripCreateDto, folder);

        LocalDate startDate = newTrip.getStartDate();
        LocalDate endDate = newTrip.getEndDate();

        List<TripDay> tripDayList = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            TripDay tripDay = TripDay.builder()
                    .day(date.getDayOfWeek())
                    .trip(newTrip)
                    .build();

            tripDayList.add(tripDay);
        }

        log.debug("{} :: Created {} Day entities for trip from {} to {}.",
                logPrefix, tripDayList.size(), startDate, endDate);

        newTrip.setTripDays(tripDayList);

        Trip savedTrip = tripRepository.save(newTrip);
        log.info("{} :: Saved new trip with id {} for userId {}.", logPrefix, savedTrip.getId(), loggedInUserId);

        folderCacheService.evictFoldersByUserId(loggedInUserId);

        return TripMapper.fromTripToTripDetailsDtoV2(savedTrip);
    }

    @Transactional
    @Override
    public TripDetailsDtoV1 renameTrip(Long tripId, String newTripName) {
        String logPrefix = "renameTrip";

        Trip trip = findTripById(logPrefix, tripId);

        String loggedInUserId = userService.getUserIdFromContextHolder();

        validateTripOwnership(logPrefix, trip, loggedInUserId);

        trip.setName(newTripName);
        log.info("{} :: Renamed trip with the id {} to {}.", logPrefix, tripId, newTripName);

        tripCacheService.evictTripsByTripId(tripId);
        folderCacheService.evictFoldersByUserId(loggedInUserId);

        return TripMapper.fromTripToTripDetailsDtoV1(trip);
    }

    @Transactional
    @Override
    public void deleteTrip(Long tripId) {
        String logPrefix = "deleteTrip";

        Trip trip = findTripById(logPrefix, tripId);

        String loggedInUserId = userService.getUserIdFromContextHolder();

        validateTripOwnership(logPrefix, trip, loggedInUserId);

        tripRepository.delete(trip);

        tripCacheService.evictTripsByTripId(tripId);
        dayCacheService.evictDaysByTripId(tripId);
        folderCacheService.evictFoldersByUserId(loggedInUserId);

        log.info("{} :: Deleted trip with the id {}.", logPrefix, tripId);
    }

    private Folder findFolderById(String logPrefix, Long folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> {
                    log.info("{} :: Folder not found with the id {}.", logPrefix, folderId);
                    return new FolderNotFoundException("Folder not found");
                });
    }

    private Trip findTripById(String logPrefix, Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> {
                    log.info("{} :: Trip not found with the id {}.", logPrefix, tripId);
                    return new TripNotFoundException("Trip not found.");
                });
    }

    private void validateTripOwnership(String logPrefix, Trip trip, String userId) {
        Folder folder = trip.getFolder();
        if (folder == null) {
            log.warn("{} :: Trip id {} has no folder assigned, userId {}.", logPrefix, trip.getId(), userId);
            throw new AccessDeniedException("You are not authorized to access this trip.");
        }

        AppUser appUser = folder.getAppUser();
        if (appUser == null || !userId.equals(appUser.getId())) {
            log.warn("{} :: Unauthorized access attempt on Trip id {} by userId {}.",
                    logPrefix, trip.getId(), userId);
            throw new AccessDeniedException("You are not authorized to access this trip.");
        }
    }

    private void validateFolderOwnership(String logPrefix, Folder folder, String userId) {
        if (!folder.getAppUser().getId().equals(userId)) {
            log.warn("{} :: Someone tried to access a Folder without permission with userId {}.",
                    logPrefix, userId);
            throw new AccessDeniedException("You are not authorized to access this folder.");
        }
    }
}
