package com.travelPlanner.planner.dto.tripDay;

import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV1;
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
import java.time.LocalDateTime;
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
    private List<ActivityDetailsDtoV1> activities = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Serial
    private static final long serialVersionUID = 1L;

}
