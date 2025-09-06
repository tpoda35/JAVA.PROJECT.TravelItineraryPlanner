package com.travelPlanner.planner.dto.websocket.activity;

import com.travelPlanner.planner.Enum.TripDayWsType;
import com.travelPlanner.planner.dto.accommodation.AccommodationDetailsDtoV3;
import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV3;
import com.travelPlanner.planner.dto.food.FoodDetailsDtoV3;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//@ValidActivityWsRequest
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripDayWsDto {

    @NotNull(message = "Type is required.")
    @Enumerated(EnumType.STRING)
    private TripDayWsType type;

    private Long entityId; // only used for requests

    private ActivityDetailsDtoV3 activity;
    private AccommodationDetailsDtoV3 accommodation;
    private FoodDetailsDtoV3 food;

}
