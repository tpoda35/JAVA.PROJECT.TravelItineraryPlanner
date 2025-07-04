package com.travelPlanner.planner.dto.trip;

import com.travelPlanner.planner.dto.tripDay.TripDayDetailsDtoV1;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripDetailsDtoV1 implements Serializable {

    private Long id;
    private String name;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Set<TripDayDetailsDtoV1> tripDays = new HashSet<>();

    @Serial
    private static final long serialVersionUID = 1L;

}
