package com.travelPlanner.planner.dto.day;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.DayOfWeek;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DayDetailsDtoV1 implements Serializable {

    private Long id;

    @Enumerated(EnumType.STRING)
    private DayOfWeek day;

}
