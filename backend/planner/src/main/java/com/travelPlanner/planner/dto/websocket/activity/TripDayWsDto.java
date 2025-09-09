package com.travelPlanner.planner.dto.websocket.activity;

import com.travelPlanner.planner.enums.TripDayWsType;
import com.travelPlanner.planner.dto.accommodation.TripDayAccommodationDetailsDtoV3;
import com.travelPlanner.planner.dto.activity.TripDayActivityDetailsDtoV3;
import com.travelPlanner.planner.dto.food.TripDayFoodDetailsDtoV3;
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

    private TripDayActivityDetailsDtoV3 activity;
    private TripDayAccommodationDetailsDtoV3 accommodation;
    private TripDayFoodDetailsDtoV3 food;

}
