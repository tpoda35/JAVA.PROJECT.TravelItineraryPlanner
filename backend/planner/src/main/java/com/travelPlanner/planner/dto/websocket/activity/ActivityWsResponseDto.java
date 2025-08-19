package com.travelPlanner.planner.dto.websocket.activity;

import com.travelPlanner.planner.Enum.ActivityWsType;
import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV2;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityWsResponseDto {

    @Enumerated(EnumType.STRING)
    private ActivityWsType type;
    private ActivityDetailsDtoV2 activityDetailsDtoV2;

}
