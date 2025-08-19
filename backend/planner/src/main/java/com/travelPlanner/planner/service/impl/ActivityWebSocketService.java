package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.Enum.ActivityWsType;
import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.activity.ActivityWsResponseDto;
import com.travelPlanner.planner.exception.ActivityNotFoundException;
import com.travelPlanner.planner.exception.TripDayNotFoundException;
import com.travelPlanner.planner.mapper.ActivityMapper;
import com.travelPlanner.planner.model.Activity;
import com.travelPlanner.planner.model.TripDay;
import com.travelPlanner.planner.repository.ActivityRepository;
import com.travelPlanner.planner.repository.TripDayRepository;
import com.travelPlanner.planner.service.IActivityWebSocketService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

import static com.travelPlanner.planner.Enum.ActivityWsType.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityWebSocketService implements IActivityWebSocketService {

    private final ActivityRepository activityRepository;
    private final TripDayRepository tripDayRepository;

    @Transactional
    @Override
    public ActivityWsResponseDto create(ActivityDetailsDtoV3 activityDetailsDtoV3, Long tripDayId) {
        String logPrefix = "WsActivityCreate";

        Activity newActivity = ActivityMapper.fromActivityDetailsDtoV3toActivity(activityDetailsDtoV3, findTripDayById(logPrefix, tripDayId));

        log.info("{} :: Creating new Activity. Details: {}.", logPrefix, activityDetailsDtoV3);
        return ActivityMapper.createActivityWsResponseDto(ACTIVITY_CREATED, activityRepository.save(newActivity));
    }

    @Transactional
    @Override
    public ActivityWsResponseDto updateField(ActivityWsType type, ActivityDetailsDtoV3 dto, Long activityId) {
        return switch (type) {
            case ACTIVITY_UPDATED_TITLE -> updateTitle(dto.getTitle(), activityId);
            case ACTIVITY_UPDATED_DESCRIPTION -> updateDescription(dto.getDescription(), activityId);
            case ACTIVITY_UPDATED_START_DATE -> updateStartDate(dto.getStartDate(), activityId);
            case ACTIVITY_UPDATED_END_DATE -> updateEndDate(dto.getEndDate(), activityId);
            default -> throw new IllegalArgumentException("Unsupported update type: " + type);
        };
    }

    private ActivityWsResponseDto updateTitle(String title, Long activityId) {
        String logPrefix = "WsUpdateTitle";

        Activity activity = findActivityById(logPrefix, activityId);
        activity.setTitle(title);
        return ActivityMapper.createActivityWsResponseDto(ACTIVITY_UPDATED_TITLE, activityRepository.save(activity));
    }

    private ActivityWsResponseDto updateDescription(String description, Long activityId) {
        String logPrefix = "WsUpdateDescription";

        Activity activity = findActivityById(logPrefix, activityId);
        activity.setDescription(description);
        return ActivityMapper.createActivityWsResponseDto(ACTIVITY_UPDATED_DESCRIPTION, activityRepository.save(activity));
    }

    private ActivityWsResponseDto updateStartDate(ZonedDateTime startDate, Long activityId) {
        String logPrefix = "WsUpdateStartDate";

        Activity activity = findActivityById(logPrefix, activityId);
        activity.setStartDate(startDate);
        return ActivityMapper.createActivityWsResponseDto(ACTIVITY_UPDATED_START_DATE, activityRepository.save(activity));
    }

    private ActivityWsResponseDto updateEndDate(ZonedDateTime endDate, Long activityId) {
        String logPrefix = "WsUpdateEndDate";

        Activity activity = findActivityById(logPrefix, activityId);
        activity.setEndDate(endDate);
        return ActivityMapper.createActivityWsResponseDto(ACTIVITY_UPDATED_END_DATE, activityRepository.save(activity));
    }


    @Transactional
    @Override
    public ActivityWsResponseDto delete(Long activityId) {
        String logPrefix = "WsDelete";

        activityRepository.delete(
                findActivityById(logPrefix ,activityId)
        );

        return ActivityMapper.createActivityWsResponseDto(ACTIVITY_DELETED, activityId);
    }

    private TripDay findTripDayById(String logPrefix, Long tripDayId) {
        return tripDayRepository.findById(tripDayId)
                .orElseThrow(() -> {
                    log.info("{} :: TripDay not found with the id {}.", logPrefix, tripDayId);
                    return new TripDayNotFoundException("Day not found.");
                });
    }

    private Activity findActivityById(String logPrefix, Long activityId) {
        return activityRepository.findById(activityId)
                .orElseThrow(() -> {
                    log.info("{} :: Activity not found with the id {}.", logPrefix, activityId);
                    return new ActivityNotFoundException("Activity not found.");
                });
    }
}
