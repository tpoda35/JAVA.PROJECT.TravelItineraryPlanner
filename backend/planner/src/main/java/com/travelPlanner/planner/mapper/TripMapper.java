package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.activity.ActivityDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV2;
import com.travelPlanner.planner.dto.tripDay.TripDayDetailsDtoV1;
import com.travelPlanner.planner.model.Activity;
import com.travelPlanner.planner.model.Folder;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.model.TripDay;

import java.util.Comparator;
import java.util.List;

public class TripMapper {

    public static TripDetailsDtoV1 fromTripToTripDetailsDtoV1(Trip trip, List<TripDay> tripDays) {
        return TripDetailsDtoV1.builder()
                .id(trip.getId())
                .name(trip.getName())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .tripDays(
                        tripDays.stream()
                                .sorted(Comparator.comparing(TripDay::getDate))
                                .map(day -> TripDayDetailsDtoV1.builder()
                                        .id(day.getId())
                                        .day(day.getDay())
                                        .date(day.getDate())
                                        .createdAt(day.getCreatedAt())
                                        .updatedAt(day.getUpdatedAt())
                                        .activities(
                                                day.getActivities().stream()
                                                        .sorted(Comparator.comparing(Activity::getStartDate))
                                                        .map(activity -> ActivityDetailsDtoV1.builder()
                                                                .id(activity.getId())
                                                                .title(activity.getTitle())
                                                                .description(activity.getDescription())
                                                                .startDate(activity.getStartDate())
                                                                .endDate(activity.getEndDate())
                                                                .createdAt(activity.getCreatedAt())
                                                                .updatedAt(activity.getUpdatedAt())
                                                                .build()
                                                        )
                                                        .toList()
                                        )
                                        .build()
                                )
                                .toList()
                )
                .build();
    }

    public static TripDetailsDtoV2 fromTripToTripDetailsDtoV2(Trip trip) {
        return TripDetailsDtoV2.builder()
                .id(trip.getId())
                .name(trip.getName())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .build();
    }

    public static Trip fromTripCreateDtoToTrip(TripCreateDto tripCreateDto, Folder folder) {
        return Trip.builder()
                .name(tripCreateDto.getName())
                .destination(tripCreateDto.getDestination())
                .startDate(tripCreateDto.getStartDate())
                .endDate(tripCreateDto.getEndDate())
                .folder(folder)
                .build();
    }

}
