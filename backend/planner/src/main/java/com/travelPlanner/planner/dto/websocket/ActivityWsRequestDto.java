package com.travelPlanner.planner.dto.websocket;

import com.travelPlanner.planner.Enum.ActivityWsType;
import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV3;
import com.travelPlanner.planner.validation.ValidActivityWsRequest;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@ValidActivityWsRequest
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityWsRequestDto {

    @NotNull(message = "Type is required.")
    @Enumerated(EnumType.STRING)
    private ActivityWsType type;
    private ActivityDetailsDtoV3 activityDetailsDtoV3;
    private Long activityId;

}
