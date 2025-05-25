package com.travelPlanner.planner.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = DateRangeValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidDateRange {

    String message() default "Start date must be before end date, with at least one day between";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
