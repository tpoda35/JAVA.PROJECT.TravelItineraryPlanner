package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.model.Trip;
import org.springframework.data.domain.Page;

public class TripMapper {

    public static Page<TripDetailsDtoV1> fromTripPageToTripDetailsDtoV1(Page<Trip> trips) {
        return trips.map(trip -> TripDetailsDtoV1.builder()
                .id(trip.getId())
                .name(trip.getName())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .days(trip.getDays())
                .build());
    }

}
