package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.exception.TripNotFoundException;
import com.travelPlanner.planner.mapper.TripMapper;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.repository.TripRepository;
import com.travelPlanner.planner.service.ICacheService;
import com.travelPlanner.planner.service.ITripService;
import com.travelPlanner.planner.service.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripService implements ITripService {

    private final IUserService userService;
    private final ICacheService cacheService;
    private final TransactionTemplate transactionTemplate;
    private final TripRepository tripRepository;

    @Async
    @Override
    public CompletableFuture<Page<TripDetailsDtoV1>> getTripsByLoggedInUser(int pageNum, int pageSize) {
        String loggedInUserId = userService.getUserIdFromContextHolder();
        String logPrefix = "getTripsByLoggedInUser";


        Page<Trip> trips = cacheService.getOrLoadTrips(pageNum, pageSize, loggedInUserId, logPrefix, () ->
                transactionTemplate.execute(status -> {
                    Page<Trip> dbTrips = tripRepository.getTripsByAppUser_Id(PageRequest.of(pageNum, pageSize), loggedInUserId);
                    if (dbTrips.isEmpty()) {
                        throw new TripNotFoundException("No trip(s) found.");
                    }
                    dbTrips.forEach(trip -> Hibernate.initialize(trip.getDays()));
                    return dbTrips;
                })
        );

        return CompletableFuture.completedFuture(
                TripMapper.fromTripPageToTripDetailsDtoV1(trips)
        );
    }

    @Async
    @Override
    public CompletableFuture<List<TripDetailsDtoV1>> getDaysByTripId(Long tripId) {
        return null;
    }

    @Override
    public TripDetailsDtoV1 addTripToLoggedInUser(TripCreateDto tripCreateDto) {
        return null;
    }

    @Override
    public TripDetailsDtoV1 renameTrip(Long tripId) {
        return null;
    }

    @Override
    public ResponseEntity<Void> deleteTrip(Long tripId) {
        return null;
    }
}
