//package com.travelPlanner.planner.validation;
//
//import com.travelPlanner.planner.dto.websocket.note.OverviewWsDto;
//import jakarta.validation.ConstraintValidator;
//import jakarta.validation.ConstraintValidatorContext;
//
//public class NoteWsRequestValidator implements ConstraintValidator<ValidNoteWsRequest, OverviewWsDto> {
//
//    @Override
//    public boolean isValid(OverviewWsDto dto, ConstraintValidatorContext context) {
//        if (dto == null || dto.getType() == null) {
//            return false;
//        }
//
//        boolean valid = true;
//        context.disableDefaultConstraintViolation();
//
//        switch (dto.getType()) {
//            case NOTE_UPDATED:
//                if (dto.getNoteId() == null) {
//                    context.buildConstraintViolationWithTemplate("NoteId is required.")
//                            .addPropertyNode("noteId")
//                            .addConstraintViolation();
//                    valid = false;
//                } else {
//                    if (dto.getContent() == null) {
//                        context.buildConstraintViolationWithTemplate("Content is required.")
//                                .addPropertyNode("content")
//                                .addConstraintViolation();
//                        valid = false;
//                    }
//                }
//                break;
//
//            case NOTE_DELETED:
//                if (dto.getNoteId() == null) {
//                    context.buildConstraintViolationWithTemplate("NoteId is required.")
//                            .addPropertyNode("noteId")
//                            .addConstraintViolation();
//                    valid = false;
//                }
//                break;
//        }
//
//        return valid;
//    }
//
//}
