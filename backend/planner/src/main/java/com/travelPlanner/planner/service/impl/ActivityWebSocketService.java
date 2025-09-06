package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.Enum.TripDayWsType;
import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.activity.TripDayWsDto;
import com.travelPlanner.planner.exception.ActivityNotFoundException;
import com.travelPlanner.planner.exception.TripDayNotFoundException;
import com.travelPlanner.planner.mapper.ActivityMapper;
import com.travelPlanner.planner.mapper.TripDayWsMapper;
import com.travelPlanner.planner.model.TripDayActivity;
import com.travelPlanner.planner.model.TripDay;
import com.travelPlanner.planner.repository.ActivityRepository;
import com.travelPlanner.planner.repository.TripDayRepository;
import com.travelPlanner.planner.service.IActivityWebSocketService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

import static com.travelPlanner.planner.Enum.TripDayWsType.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityWebSocketService implements IActivityWebSocketService {

    private final ActivityRepository activityRepository;
    private final TripDayRepository tripDayRepository;

    @Transactional
    @Override
    public TripDayWsDto create(ActivityDetailsDtoV3 activityDetailsDtoV3, Long tripDayId) {
        String logPrefix = "WsActivityCreate";

        TripDayActivity newTripDayActivity = ActivityMapper.fromActivityDetailsDtoV3toActivity(activityDetailsDtoV3, findTripDayById(logPrefix, tripDayId));

        log.info("{} :: Creating new Activity. Details: {}.", logPrefix, activityDetailsDtoV3);
        return TripDayWsMapper.createActivityTripDayWsDto(ACTIVITY_CREATED, activityRepository.save(newTripDayActivity));
    }

    @Transactional
    @Override
    public TripDayWsDto updateField(TripDayWsType type, ActivityDetailsDtoV3 dto, Long activityId) {
        return switch (type) {
            case ACTIVITY_UPDATED_TITLE -> updateTitle(dto.getTitle(), activityId);
            case ACTIVITY_UPDATED_DESCRIPTION -> updateDescription(dto.getDescription(), activityId);
            case ACTIVITY_UPDATED_START_DATE -> updateStartDate(dto.getStartDate(), activityId);
            case ACTIVITY_UPDATED_END_DATE -> updateEndDate(dto.getEndDate(), activityId);
            default -> throw new IllegalArgumentException("Unsupported update type: " + type);
        };
    }

    private TripDayWsDto updateTitle(String title, Long activityId) {
        String logPrefix = "WsActivityUpdateTitle";

        TripDayActivity tripDayActivity = findActivityById(logPrefix, activityId);
        tripDayActivity.setTitle(title);

        log.info("{} :: Updated Activity title with id {} to {}.", logPrefix, tripDayActivity, title);

        return TripDayWsMapper.createActivityTripDayWsDto(ACTIVITY_UPDATED_TITLE, activityRepository.save(tripDayActivity));
    }

    private TripDayWsDto updateDescription(String description, Long activityId) {
        String logPrefix = "WsActivityUpdateDescription";

        TripDayActivity tripDayActivity = findActivityById(logPrefix, activityId);
        tripDayActivity.setDescription(description);

        log.info("{} :: Updated Activity description with id {} to {}.", logPrefix, tripDayActivity, description);

        return TripDayWsMapper.createActivityTripDayWsDto(ACTIVITY_UPDATED_DESCRIPTION, activityRepository.save(tripDayActivity));
    }

    private TripDayWsDto updateStartDate(ZonedDateTime startDate, Long activityId) {
        String logPrefix = "WsActivityUpdateStartDate";

        TripDayActivity tripDayActivity = findActivityById(logPrefix, activityId);
        tripDayActivity.setStartDate(startDate);

        log.info("{} :: Updated Activity start date with id {} to {}.", logPrefix, tripDayActivity, startDate);

        return TripDayWsMapper.createActivityTripDayWsDto(ACTIVITY_UPDATED_START_DATE, activityRepository.save(tripDayActivity));
    }

    private TripDayWsDto updateEndDate(ZonedDateTime endDate, Long activityId) {
        String logPrefix = "WsActivityUpdateEndDate";

        TripDayActivity tripDayActivity = findActivityById(logPrefix, activityId);
        tripDayActivity.setEndDate(endDate);

        log.info("{} :: Updated Activity end date with id {} to {}.", logPrefix, tripDayActivity, endDate);

        return TripDayWsMapper.createActivityTripDayWsDto(ACTIVITY_UPDATED_END_DATE, activityRepository.save(tripDayActivity));
    }


    @Transactional
    @Override
    public TripDayWsDto delete(Long activityId) {
        String logPrefix = "WsActivityDelete";

        activityRepository.delete(
                findActivityById(logPrefix ,activityId)
        );

        log.info("{} :: Deleted Activity with id {}.", logPrefix, activityId);

        return TripDayWsMapper.createTripDayWsDto(ACTIVITY_DELETED, activityId);
    }

    private TripDay findTripDayById(String logPrefix, Long tripDayId) {
        return tripDayRepository.findById(tripDayId)
                .orElseThrow(() -> {
                    log.info("{} :: TripDay not found with the id {}.", logPrefix, tripDayId);
                    return new TripDayNotFoundException("Day not found.");
                });
    }

    private TripDayActivity findActivityById(String logPrefix, Long activityId) {
        return activityRepository.findById(activityId)
                .orElseThrow(() -> {
                    log.info("{} :: Activity not found with the id {}.", logPrefix, activityId);
                    return new ActivityNotFoundException("Activity not found.");
                });
    }
}
