package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.accommodation.TripDayAccommodationDetailsDtoV3;
import com.travelPlanner.planner.model.TripDay;
import com.travelPlanner.planner.model.TripDayAccommodation;

public class TripDayAccommodationMapper {

    public static TripDayAccommodation fromDetailsDtoV3ToAccommodation(
            TripDayAccommodationDetailsDtoV3 tripDayAccommodationDetailsDtoV3, TripDay tripDay
    ) {
        return TripDayAccommodation.builder()
                .name(tripDayAccommodationDetailsDtoV3.getName())
                .address(tripDayAccommodationDetailsDtoV3.getAddress())
                .checkIn(tripDayAccommodationDetailsDtoV3.getCheckIn())
                .checkOut(tripDayAccommodationDetailsDtoV3.getCheckOut())
                .notes(tripDayAccommodationDetailsDtoV3.getNotes())
                .tripDay(tripDay)
                .build();
    }

}
