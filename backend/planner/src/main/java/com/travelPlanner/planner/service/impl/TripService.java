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
import com.travelPlanner.planner.model.Day;
import com.travelPlanner.planner.model.Folder;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.repository.FolderRepository;
import com.travelPlanner.planner.repository.TripRepository;
import com.travelPlanner.planner.service.*;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
    public CompletableFuture<Page<TripDetailsDtoV1>> getTripsByLoggedInUser(int pageNum, int pageSize) {
        String loggedInUserId = userService.getUserIdFromContextHolder();
        String logPrefix = "getTripsByLoggedInUser";

        Page<TripDetailsDtoV1> trips = tripCacheService.getOrLoadTrips(pageNum, pageSize, loggedInUserId, logPrefix, () ->
                transactionTemplate.execute(status -> {
                    Page<Trip> dbTrips = tripRepository.getTripsByAppUser_Id(PageRequest.of(pageNum, pageSize), loggedInUserId);
                    if (dbTrips.isEmpty()) {
                        throw new TripNotFoundException("No trip(s) found.");
                    }
                    return TripMapper.fromTripPageToTripDetailsDtoV1Page(dbTrips);
                })
        );

        return CompletableFuture.completedFuture(
                trips
        );
    }

    @Async
    @Override
    public CompletableFuture<List<DayDetailsDtoV1>> getDaysByTripId(Long tripId) {
        String logPrefix = "getDaysByTripId";

        return CompletableFuture.completedFuture(dayCacheService.getOrLoadDays(tripId, logPrefix, () ->
                transactionTemplate.execute(status -> {
                    List<Day> days = tripRepository.findById(tripId)
                            .orElseThrow(() -> new TripNotFoundException("Trip not found."))
                            .getDays();

                    return DayMapper.fromDayListToDayDetailsDtoV1List(days);
                })
        ));
    }


    @Transactional
    @Override
    public TripDetailsDtoV2 addTripToFolder(@Valid TripCreateDto tripCreateDto) {
        String logPrefix = "addTripToFolder";

        Folder folder = folderRepository.findById(tripCreateDto.getFolderId())
                .orElseThrow(() -> new FolderNotFoundException("Folder not found"));

        AppUser loggedInUser = userService.getLoggedInUser();
        String loggedInUserId = loggedInUser.getId();

        validateFolderOwnership(folder, loggedInUser);

        Trip newTrip = TripMapper.fromTripCreateDtoToTrip(tripCreateDto, folder);

        LocalDate startDate = newTrip.getStartDate();
        LocalDate endDate = newTrip.getEndDate();

        List<Day> dayList = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            Day day = Day.builder()
                    .day(date.getDayOfWeek())
                    .trip(newTrip)
                    .build();

            dayList.add(day);
        }

        log.debug("{} :: Created {} Day entities for trip from {} to {}",
                logPrefix, dayList.size(), startDate, endDate);

        newTrip.setDays(dayList);
        newTrip.setAppUser(loggedInUser);

        Trip savedTrip = tripRepository.save(newTrip);
        log.info("{} :: Saved new trip with id {} for userId {}", logPrefix, savedTrip.getId(), loggedInUserId);

        tripCacheService.evictTripsByUserId(loggedInUserId);
        folderCacheService.evictFoldersByUserId(loggedInUserId);

        return TripMapper.fromTripToTripDetailsDtoV2(savedTrip);
    }

    @Transactional
    @Override
    public TripDetailsDtoV1 renameTrip(Long tripId, String newTripName) {
        String logPrefix = "renameTrip";

        Trip trip = findTripById(tripId);

        String loggedInUserId = userService.getUserIdFromContextHolder();

        validateTripOwnership(trip, loggedInUserId);

        trip.setName(newTripName);
        log.info("{} :: Renamed trip with the id {} to {}.", logPrefix, tripId, newTripName);

        tripCacheService.evictTripsByUserId(loggedInUserId);

        return TripMapper.fromTripToTripDetailsDtoV1(trip);
    }

    @Transactional
    @Override
    public void deleteTrip(Long tripId) {
        String logPrefix = "deleteTrip";

        Trip trip = findTripById(tripId);

        String loggedInUserId = userService.getUserIdFromContextHolder();

        validateTripOwnership(trip, loggedInUserId);

        tripRepository.delete(trip);

        tripCacheService.evictTripsByUserId(loggedInUserId);
        dayCacheService.evictDaysByTripId(tripId);

        log.info("{} :: Deleted trip with the id {}.", logPrefix, tripId);
    }

    private Trip findTripById(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new TripNotFoundException("Trip not found."));
    }

    private void validateTripOwnership(Trip trip, String userId) {
        if (!trip.getAppUser().getId().equals(userId)) {
            throw new AccessDeniedException("You are not authorized to access this trip.");
        }
    }

    private void validateFolderOwnership(Folder folder, AppUser loggedInUser) {
        if (!folder.getAppUser().getId().equals(loggedInUser.getId())) {
            throw new AccessDeniedException("You are not authorized to access this folder.");
        }
    }
}
