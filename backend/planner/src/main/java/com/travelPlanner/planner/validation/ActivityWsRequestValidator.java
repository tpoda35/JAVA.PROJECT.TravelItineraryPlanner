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
                if (dto.getActivityDetailsDtoV3() == null) {
                    context.buildConstraintViolationWithTemplate("Activity details must be provided.")
                            .addPropertyNode("activityDetailsDtoV3")
                            .addConstraintViolation();
                    valid = false;
                } else {
                    if (dto.getActivityDetailsDtoV3().getTitle() == null) {
                        context.buildConstraintViolationWithTemplate("Title is required.")
                                .addPropertyNode("title")
                                .addConstraintViolation();
                        valid = false;
                    }
                    if (dto.getActivityDetailsDtoV3().getStartDate() == null) {
                        context.buildConstraintViolationWithTemplate("Start date is required.")
                                .addPropertyNode("startDate")
                                .addConstraintViolation();
                        valid = false;
                    }
                    if (dto.getActivityDetailsDtoV3().getEndDate() == null) {
                        context.buildConstraintViolationWithTemplate("End date is required.")
                                .addPropertyNode("endDate")
                                .addConstraintViolation();
                        valid = false;
                    }
                }
                break;

            case ACTIVITY_UPDATED_TITLE:
                if (
                        dto.getActivityDetailsDtoV3() == null ||
                                dto.getActivityId() == null ||
                                dto.getActivityDetailsDtoV3().getTitle() == null
                ) {
                    context.buildConstraintViolationWithTemplate("Title is required.")
                            .addPropertyNode("title")
                            .addConstraintViolation();
                    valid = false;
                }
                break;

            case ACTIVITY_UPDATED_DESCRIPTION:
                if (
                        dto.getActivityDetailsDtoV3() == null ||
                                dto.getActivityId() == null ||
                                dto.getActivityDetailsDtoV3().getDescription() == null
                ) {
                    context.buildConstraintViolationWithTemplate("Description is required.")
                            .addPropertyNode("description")
                            .addConstraintViolation();
                    valid = false;
                }
                break;

            case ACTIVITY_UPDATED_START_DATE:
                if (
                        dto.getActivityDetailsDtoV3() == null ||
                                dto.getActivityId() == null ||
                                dto.getActivityDetailsDtoV3().getStartDate() == null
                ) {
                    context.buildConstraintViolationWithTemplate("Start date is required.")
                            .addPropertyNode("startDate")
                            .addConstraintViolation();
                    valid = false;
                }
                break;

            case ACTIVITY_UPDATED_END_DATE:
                if (
                        dto.getActivityDetailsDtoV3() == null ||
                                dto.getActivityId() == null ||
                                dto.getActivityDetailsDtoV3().getEndDate() == null
                ) {
                    context.buildConstraintViolationWithTemplate("End date is required.")
                            .addPropertyNode("endDate")
                            .addConstraintViolation();
                    valid = false;
                }
                break;

            case ACTIVITY_DELETED:
                if (dto.getActivityId() == null) {
                    context.buildConstraintViolationWithTemplate("ActivityId is required.")
                            .addPropertyNode("activityId")
                            .addConstraintViolation();
                    valid = false;
                }
                break;
        }

        return valid;
    }
}
