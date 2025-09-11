package com.travelPlanner.planner.dto.tripDay;

import com.travelPlanner.planner.dto.accommodation.TripDayAccommodationDetailsDtoV1;
import com.travelPlanner.planner.dto.activity.TripDayActivityDetailsDtoV1;
import com.travelPlanner.planner.dto.food.TripDayFoodDetailsDtoV1;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripDayDetailsDtoV1 implements Serializable {

    private Long id;

    @Enumerated(EnumType.STRING)
    private DayOfWeek day;

    private LocalDate date;
    private List<TripDayActivityDetailsDtoV1> tripDayActivities = new ArrayList<>();
    private List<TripDayAccommodationDetailsDtoV1> tripDayAccommodations = new ArrayList<>();
    private List<TripDayFoodDetailsDtoV1> tripDayFoods = new ArrayList<>();

    @Serial
    private static final long serialVersionUID = 1L;

}
