package com.travelPlanner.planner.validation;

import com.travelPlanner.planner.dto.websocket.notes.NoteWsRequestDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NoteWsRequestValidator implements ConstraintValidator<ValidNoteWsRequest, NoteWsRequestDto> {

    @Override
    public boolean isValid(NoteWsRequestDto noteWsRequestDto, ConstraintValidatorContext constraintValidatorContext) {
        return false;
    }

}
