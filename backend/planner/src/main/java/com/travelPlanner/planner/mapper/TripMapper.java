package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV2;
import com.travelPlanner.planner.model.Trip;
import org.springframework.data.domain.Page;

public class TripMapper {

    public static Page<TripDetailsDtoV1> fromTripPageToTripDetailsDtoV1Page(Page<Trip> trips) {
        return trips.map(trip -> TripDetailsDtoV1.builder()
                .id(trip.getId())
                .name(trip.getName())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .build());
    }

    public static TripDetailsDtoV2 fromTripToTripDetailsDtoV2(Trip trip) {
        return TripDetailsDtoV2.builder()
                .id(trip.getId())
                .name(trip.getName())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .days(trip.getDays())
                .build();
    }

    public static Trip fromTripCreateDtoToTrip(TripCreateDto tripCreateDto) {
        return Trip.builder()
                .name(tripCreateDto.getName())
                .destination(tripCreateDto.getDestination())
                .startDate(tripCreateDto.getStartDate())
                .endDate(tripCreateDto.getEndDate())
                .build();
    }

}
