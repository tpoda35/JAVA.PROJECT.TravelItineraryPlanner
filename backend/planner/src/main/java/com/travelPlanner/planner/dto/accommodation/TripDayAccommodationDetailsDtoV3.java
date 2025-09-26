package com.travelPlanner.planner.dto.accommodation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripDayAccommodationDetailsDtoV3 {

    private Long id;
    private String name;
    private String address;
    private ZonedDateTime checkIn;
    private ZonedDateTime checkOut;
    private String notes;

}
