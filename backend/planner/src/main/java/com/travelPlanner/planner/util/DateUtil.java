package com.travelPlanner.planner.util;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Stream;

public class DateUtil {

    public static List<DayOfWeek> getDayNamesBetween(LocalDate start, LocalDate end) {
        return Stream.iterate(start, date -> date.plusDays(1))
                .limit(ChronoUnit.DAYS.between(start, end))
                .map(LocalDate::getDayOfWeek)
                .toList();
    }

}
