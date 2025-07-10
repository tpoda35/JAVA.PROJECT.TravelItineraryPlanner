package com.travelPlanner.planner.validation;

import com.travelPlanner.planner.dto.websocket.ActivityWsRequestDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ActivityWsRequestValidator implements ConstraintValidator<ValidActivityWsRequest, ActivityWsRequestDto> {

    @Override
    public boolean isValid(ActivityWsRequestDto dto, ConstraintValidatorContext context) {
        if (dto == null || dto.getType() == null) {
            return false;
        }

        boolean valid = true;
        context.disableDefaultConstraintViolation();

        switch (dto.getType()) {
            case ACTIVITY_CREATED:
            case ACTIVITY_UPDATED:
                if (dto.getActivityDetailsDtoV3() == null) {
                    context.buildConstraintViolationWithTemplate("Activity details must be provided.")
                            .addPropertyNode("activityDetailsDtoV3")
                            .addConstraintViolation();
                    valid = false;
                }
                break;

            case ACTIVITY_DELETED:
                if (dto.getActivityId() == null) {
                    context.buildConstraintViolationWithTemplate("Activity ID is required for deletion.")
                            .addPropertyNode("activityId")
                            .addConstraintViolation();
                    valid = false;
                }
                break;
        }

        return valid;
    }
}
