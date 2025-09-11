package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.accommodation.TripDayAccommodationDetailsDtoV1;
import com.travelPlanner.planner.dto.activity.TripDayActivityDetailsDtoV1;
import com.travelPlanner.planner.dto.food.TripDayFoodDetailsDtoV1;
import com.travelPlanner.planner.dto.notes.TripNoteDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripCreateDto;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV1;
import com.travelPlanner.planner.dto.trip.TripDetailsDtoV2;
import com.travelPlanner.planner.dto.tripDay.TripDayDetailsDtoV1;
import com.travelPlanner.planner.model.*;

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
                                        .tripDayActivities(
                                                day.getActivities().stream()
                                                        .sorted(Comparator.comparing(TripDayActivity::getStartDate))
                                                        .map(activity -> TripDayActivityDetailsDtoV1.builder()
                                                                .id(activity.getId())
                                                                .title(activity.getTitle())
                                                                .description(activity.getDescription())
                                                                .startDate(activity.getStartDate())
                                                                .endDate(activity.getEndDate())
                                                                .build()
                                                        )
                                                        .toList()
                                        )
                                        .tripDayAccommodations(
                                                day.getAccommodations().stream()
                                                        .sorted(Comparator.comparing(TripDayAccommodation::getCheckIn))
                                                        .map(accommodation -> TripDayAccommodationDetailsDtoV1.builder()
                                                                .id(accommodation.getId())
                                                                .name(accommodation.getName())
                                                                .address(accommodation.getAddress())
                                                                .checkIn(accommodation.getCheckIn())
                                                                .checkOut(accommodation.getCheckOut())
                                                                .notes(accommodation.getNotes())
                                                                .build()
                                                        )
                                                        .toList()
                                        )
                                        .tripDayFoods(
                                                day.getFoods().stream()
                                                        .sorted(Comparator.comparing(TripDayFood::getStartDate))
                                                        .map(food -> TripDayFoodDetailsDtoV1.builder()
                                                                .id(food.getId())
                                                                .name(food.getName())
                                                                .startDate(food.getStartDate())
                                                                .endDate(food.getEndDate())
                                                                .notes(food.getNotes())
                                                                .location(food.getLocation())
                                                                .mealType(food.getMealType())
                                                                .build()
                                                        )
                                                        .toList()
                                        )
                                        .build()
                                )
                                .toList()
                )
                .tripNotes(
                        trip.getTripNotes().stream().map(
                                tripNote -> TripNoteDetailsDtoV1.builder()
                                        .id(tripNote.getId())
                                        .content(tripNote.getContent())
                                        .build()
                        ).toList()
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
