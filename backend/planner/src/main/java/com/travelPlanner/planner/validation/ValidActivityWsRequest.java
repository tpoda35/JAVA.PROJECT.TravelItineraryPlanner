package com.travelPlanner.planner.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ActivityWsRequestValidator.class)
public @interface ValidActivityWsRequest {

    String message() default "Invalid activity WebSocket request";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

}
