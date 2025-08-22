package com.travelPlanner.planner.validation;

import com.travelPlanner.planner.dto.websocket.note.NoteWsDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NoteWsRequestValidator implements ConstraintValidator<ValidNoteWsRequest, NoteWsDto> {

    @Override
    public boolean isValid(NoteWsDto noteWsDto, ConstraintValidatorContext constraintValidatorContext) {
        return false;
    }

}
