package com.travelPlanner.planner.dto.food;

import com.travelPlanner.planner.enums.MealType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripDayFoodDetailsDtoV1 implements Serializable {

    private Long id;
    private String name;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private String notes;
    private String location;

    @Enumerated(EnumType.STRING)
    private MealType mealType;

    @Serial
    private static final long serialVersionUID = 1L;

}
