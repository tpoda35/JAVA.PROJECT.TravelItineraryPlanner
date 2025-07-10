package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.ActivityWsResponseDto;
import com.travelPlanner.planner.exception.TripDayNotFoundException;
import com.travelPlanner.planner.mapper.ActivityMapper;
import com.travelPlanner.planner.model.Activity;
import com.travelPlanner.planner.model.TripDay;
import com.travelPlanner.planner.repository.ActivityRepository;
import com.travelPlanner.planner.repository.TripDayRepository;
import com.travelPlanner.planner.service.IActivityService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static com.travelPlanner.planner.Enum.ActivityWsType.ACTIVITY_CREATED;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityService implements IActivityService {

    private final ActivityRepository activityRepository;
    private final TripDayRepository tripDayRepository;

    @Transactional
    @Override
    public ActivityWsResponseDto create(ActivityDetailsDtoV3 activityDetailsDtoV3, Long tripDayId) {
        String logPrefix = "WsActivityCreate";

        Activity newActivity = ActivityMapper.fromActivityDetailsDtoV3toActivity(activityDetailsDtoV3, findTripDayById(logPrefix, tripDayId));

        return ActivityMapper.createActivityWsResponseDto(ACTIVITY_CREATED, activityRepository.save(newActivity));
    }

    @Transactional
    @Override
    public ActivityWsResponseDto update(ActivityDetailsDtoV3 activityDetailsDtoV3, Long tripDayId) {
        return null;
    }

    @Transactional
    @Override
    public void delete(Long tripDayId) {

    }

    private TripDay findTripDayById(String logPrefix, Long tripDayId) {
        return tripDayRepository.findById(tripDayId)
                .orElseThrow(() -> {
                    log.info("{} :: TripDay not found with the id {}.", logPrefix, tripDayId);
                    return new TripDayNotFoundException("Day not found.");
                });
    }
}
