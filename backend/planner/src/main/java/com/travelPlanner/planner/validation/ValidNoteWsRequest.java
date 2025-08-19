package com.travelPlanner.planner.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NoteWsRequestValidator.class)
public @interface ValidNoteWsRequest {

    String message() default "Invalid note WebSocket request";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

}
