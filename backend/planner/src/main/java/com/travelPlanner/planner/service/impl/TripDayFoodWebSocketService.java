package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.food.TripDayFoodDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.activity.TripDayWsDto;
import com.travelPlanner.planner.enums.MealType;
import com.travelPlanner.planner.enums.TripDayWsType;
import com.travelPlanner.planner.exception.TripDayFoodNotFoundException;
import com.travelPlanner.planner.exception.TripDayNotFoundException;
import com.travelPlanner.planner.mapper.TripDayFoodMapper;
import com.travelPlanner.planner.mapper.TripDayWsMapper;
import com.travelPlanner.planner.model.TripDay;
import com.travelPlanner.planner.model.TripDayFood;
import com.travelPlanner.planner.repository.TripDayFoodRepository;
import com.travelPlanner.planner.repository.TripDayRepository;
import com.travelPlanner.planner.service.ITripDayFoodWebSocketService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

import static com.travelPlanner.planner.enums.TripDayWsType.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class TripDayFoodWebSocketService implements ITripDayFoodWebSocketService {

    private final TripDayRepository tripDayRepository;
    private final TripDayFoodRepository foodRepository;

    @Transactional
    @Override
    public TripDayWsDto create(TripDayFoodDetailsDtoV3 tripDayFoodDetailsDtoV3, Long tripDayId) {
        String logPrefix = "WsFoodCreate";

        TripDayFood newTripDayFood = TripDayFoodMapper.fromDetailsDtoV3ToTripDayFood(tripDayFoodDetailsDtoV3, findTripDayById(logPrefix, tripDayId));

        log.info("{} :: Creating new Food. Details: {}, tripDayId: {}.", logPrefix, tripDayFoodDetailsDtoV3, tripDayId);
        return TripDayWsMapper.createFoodTripDayWsDto(FOOD_CREATED, foodRepository.save(newTripDayFood));
    }

    @Transactional
    @Override
    public TripDayWsDto updateField(TripDayWsType type, TripDayFoodDetailsDtoV3 dto, Long foodId) {
        return switch (type) {
            case FOOD_UPDATED_NAME -> updateName(dto.getName(), foodId);
            case FOOD_UPDATED_START_DATE -> updateStartDate(dto.getStartDate(), foodId);
            case FOOD_UPDATED_END_DATE -> updateEndDate(dto.getEndDate(), foodId);
            case FOOD_UPDATED_NOTES -> updateNotes(dto.getNotes(), foodId);
            case FOOD_UPDATED_LOCATION -> updateLocation(dto.getLocation(), foodId);
            case FOOD_UPDATED_MEAL_TYPE -> updateMealType(dto.getMealType(), foodId);
            default -> throw new IllegalArgumentException("Unsupported update type: " + type);
        };
    }

    private TripDayWsDto updateName(String name, Long foodId) {
        String logPrefix = "WsFoodUpdateName";

        TripDayFood tripDayFood = findTripDayFoodById(logPrefix, foodId);
        tripDayFood.setName(name);

        log.info("{} :: Updated Food name with id {} to {}.", logPrefix, tripDayFood, name);

        return TripDayWsMapper.createFoodTripDayWsDto(FOOD_UPDATED_NAME, foodRepository.save(tripDayFood));
    }

    private TripDayWsDto updateStartDate(ZonedDateTime startDate, Long foodId) {
        String logPrefix = "WsFoodUpdateStartDate";

        TripDayFood tripDayFood = findTripDayFoodById(logPrefix, foodId);
        tripDayFood.setStartDate(startDate);

        log.info("{} :: Updated Food start-date with id {} to {}.", logPrefix, tripDayFood, startDate);

        return TripDayWsMapper.createFoodTripDayWsDto(FOOD_UPDATED_START_DATE, foodRepository.save(tripDayFood));
    }

    private TripDayWsDto updateEndDate(ZonedDateTime endDate, Long foodId) {
        String logPrefix = "WsFoodUpdateEndDate";

        TripDayFood tripDayFood = findTripDayFoodById(logPrefix, foodId);
        tripDayFood.setEndDate(endDate);

        log.info("{} :: Updated Food end-date with id {} to {}.", logPrefix, tripDayFood, endDate);

        return TripDayWsMapper.createFoodTripDayWsDto(FOOD_UPDATED_END_DATE, foodRepository.save(tripDayFood));
    }

    private TripDayWsDto updateNotes(String notes, Long foodId) {
        String logPrefix = "WsFoodUpdateNotes";

        TripDayFood tripDayFood = findTripDayFoodById(logPrefix, foodId);
        tripDayFood.setNotes(notes);

        log.info("{} :: Updated Food notes with id {} to {}.", logPrefix, tripDayFood, notes);

        return TripDayWsMapper.createFoodTripDayWsDto(FOOD_UPDATED_NOTES, foodRepository.save(tripDayFood));
    }

    private TripDayWsDto updateLocation(String location, Long foodId) {
        String logPrefix = "WsFoodUpdateLocation";

        TripDayFood tripDayFood = findTripDayFoodById(logPrefix, foodId);
        tripDayFood.setLocation(location);

        log.info("{} :: Updated Food location with id {} to {}.", logPrefix, tripDayFood, location);

        return TripDayWsMapper.createFoodTripDayWsDto(FOOD_UPDATED_LOCATION, foodRepository.save(tripDayFood));
    }

    private TripDayWsDto updateMealType(MealType mealType, Long foodId) {
        String logPrefix = "WsFoodUpdateMealType";

        TripDayFood tripDayFood = findTripDayFoodById(logPrefix, foodId);
        tripDayFood.setMealType(mealType);

        log.info("{} :: Updated Food mealType with id {} to {}.", logPrefix, tripDayFood, mealType);

        return TripDayWsMapper.createFoodTripDayWsDto(FOOD_UPDATED_MEAL_TYPE, foodRepository.save(tripDayFood));
    }

    @Transactional
    @Override
    public TripDayWsDto delete(Long foodId) {
        String logPrefix = "WsFoodDelete";

        foodRepository.delete(
                findTripDayFoodById(logPrefix, foodId)
        );

        log.info("{} :: Deleted Food with id {}.", logPrefix, foodId);

        return TripDayWsMapper.createDeleteActivityTripDayWsDto(FOOD_DELETED, foodId);
    }

    private TripDayFood findTripDayFoodById(String logPrefix, Long tripDayFoodId) {
        return foodRepository.findById(tripDayFoodId)
                .orElseThrow(() -> {
                    log.info("{} :: TripDayFood not found with the id {}.", logPrefix, tripDayFoodId);
                    return new TripDayFoodNotFoundException("Food not found.");
                });
    }

    private TripDay findTripDayById(String logPrefix, Long tripDayId) {
        return tripDayRepository.findById(tripDayId)
                .orElseThrow(() -> {
                    log.info("{} :: TripDay not found with the id {}.", logPrefix, tripDayId);
                    return new TripDayNotFoundException("Day not found.");
                });
    }
}
