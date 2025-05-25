package com.travelPlanner.planner.validation;

import com.travelPlanner.planner.dto.trip.TripCreateDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;

public class DateRangeValidator implements ConstraintValidator<ValidDateRange, TripCreateDto> {

    @Override
    public boolean isValid(TripCreateDto tripCreateDto, ConstraintValidatorContext constraintValidatorContext) {
        LocalDate start = tripCreateDto.getStartDate();
        LocalDate end = tripCreateDto.getEndDate();

        if (start == null || end == null) {
            // Let @NotNull handle null checks
            return true;
        }

        return start.isBefore(end) && start.plusDays(1).isBefore(end.plusDays(1));
    }

}
