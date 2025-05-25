package com.travelPlanner.planner.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = MaxDateLengthValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidMaxDateLength {

    String message() default "Trip must be between 1 and 14 days.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
