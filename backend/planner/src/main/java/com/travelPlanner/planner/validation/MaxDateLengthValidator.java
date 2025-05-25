package com.travelPlanner.planner.validation;

import com.travelPlanner.planner.dto.trip.TripCreateDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.temporal.ChronoUnit;

public class MaxDateLengthValidator implements ConstraintValidator<ValidMaxDateLength, TripCreateDto> {

    @Override
    public boolean isValid(TripCreateDto tripCreateDto, ConstraintValidatorContext constraintValidatorContext) {
        if (tripCreateDto.getStartDate() == null || tripCreateDto.getEndDate() == null) {
            return true; // Let @NotNull handle this
        }

        long daysBetween = ChronoUnit.DAYS.between(tripCreateDto.getStartDate(), tripCreateDto.getEndDate());

        return daysBetween >= 1 && daysBetween <= 14;
    }

}
