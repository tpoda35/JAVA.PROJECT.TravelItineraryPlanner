package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.accommodation.TripDayAccommodationDetailsDtoV3;
import com.travelPlanner.planner.dto.websocket.activity.TripDayWsDto;
import com.travelPlanner.planner.enums.TripDayWsType;
import com.travelPlanner.planner.exception.TripDayAccommodationNotFoundException;
import com.travelPlanner.planner.exception.TripDayNotFoundException;
import com.travelPlanner.planner.mapper.TripDayAccommodationMapper;
import com.travelPlanner.planner.mapper.TripDayWsMapper;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.model.TripDay;
import com.travelPlanner.planner.model.TripDayAccommodation;
import com.travelPlanner.planner.repository.TripDayAccommodationRepository;
import com.travelPlanner.planner.repository.TripDayRepository;
import com.travelPlanner.planner.service.ITripDayAccommodationWebSocketService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.travelPlanner.planner.enums.TripDayWsType.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class TripDayAccommodationWebSocketService implements ITripDayAccommodationWebSocketService {

    private final TripDayAccommodationRepository accommodationRepository;
    private final TripDayRepository tripDayRepository;

    @Transactional
    @Override
    public TripDayWsDto create(TripDayAccommodationDetailsDtoV3 dto, Long tripDayId) {
        String logPrefix = "WsAccommodationCreate";

        TripDay firstDay = findTripDayByIdWithTrip(logPrefix, tripDayId);
        Trip trip = firstDay.getTrip();

        ZoneId zone = dto.getCheckIn().getZone(); // preserve the user’s timezone

        LocalDate startDate = dto.getCheckIn().toLocalDate();
        LocalDate endDate = dto.getCheckOut().toLocalDate().minusDays(1); // exclude checkout day itself

        // find all TripDays between checkIn and (checkOut - 1)
        List<TripDay> daysInRange = tripDayRepository.findByTripIdAndDateBetween(
                trip.getId(),
                startDate,
                endDate
        );

        TripDayWsDto result = TripDayWsDto.builder()
                .type(ACCOMMODATION_CREATED)
                .accommodations(new ArrayList<>())
                .build();

        for (TripDay day : daysInRange) {
            TripDayAccommodation acc = TripDayAccommodationMapper.fromDetailsDtoV3ToAccommodation(dto, day);

            // check-in
            if (day.equals(firstDay)) {
                acc.setCheckIn(dto.getCheckIn()); // actual check-in time
            } else {
                acc.setCheckIn(day.getDate().atStartOfDay(zone)); // midnight with zone
            }

            // check-out
            if (day.getDate().equals(endDate)) {
                acc.setCheckOut(dto.getCheckOut()); // actual check-out time
            } else {
                acc.setCheckOut(day.getDate().plusDays(1).atStartOfDay(zone)); // midnight of next day with zone
            }

            TripDayAccommodation saved = accommodationRepository.save(acc);
            result.getAccommodations().add(
                    TripDayAccommodationMapper.fromAccommodationToDetailsDtoV3(saved)
            );
        }

        log.info("{} :: Created {} accommodations for tripDayId {} and range {}–{}",
                logPrefix, result.getAccommodations().size(), tripDayId, startDate, endDate);

        return result;
    }

    @Transactional
    @Override
    public TripDayWsDto updateField(TripDayWsType type, TripDayAccommodationDetailsDtoV3 dto, Long accommodationId) {
        return switch (type) {
            case ACCOMMODATION_UPDATED_NAME -> updateName(dto.getName(), accommodationId);
            case ACCOMMODATION_UPDATED_ADDRESS -> updateAddress(dto.getAddress(), accommodationId);
            case ACCOMMODATION_UPDATED_CHECK_IN -> updateCheckIn(dto.getCheckIn(), accommodationId);
            case ACCOMMODATION_UPDATED_CHECK_OUT -> updateCheckOut(dto.getCheckOut(), accommodationId);
            case ACCOMMODATION_UPDATED_NOTES -> updateNotes(dto.getNotes(), accommodationId);
            default -> throw new IllegalArgumentException("Unsupported update type: " + type);
        };
    }

    private TripDayWsDto updateName(String name, Long accommodationId) {
        String logPrefix = "WsAccommodationUpdateName";

        TripDayAccommodation tripDayAccommodation = findAccommodationById(logPrefix, accommodationId);
        tripDayAccommodation.setName(name);

        log.info("{} :: Updated Accommodation name with id {} to {}.", logPrefix, accommodationId, name);

        return TripDayWsMapper.createAccommodationTripDayWsDto(ACCOMMODATION_UPDATED_NAME, accommodationRepository.save(tripDayAccommodation));
    }

    private TripDayWsDto updateAddress(String address, Long accommodationId) {
        String logPrefix = "WsAccommodationUpdateAddress";

        TripDayAccommodation tripDayAccommodation = findAccommodationById(logPrefix, accommodationId);
        tripDayAccommodation.setAddress(address);

        log.info("{} :: Updated Accommodation address with id {} to {}.", logPrefix, accommodationId, address);

        return TripDayWsMapper.createAccommodationTripDayWsDto(ACCOMMODATION_UPDATED_ADDRESS, accommodationRepository.save(tripDayAccommodation));
    }

    private TripDayWsDto updateCheckIn(ZonedDateTime checkIn, Long accommodationId) {
        String logPrefix = "WsAccommodationUpdateCheckIn";

        TripDayAccommodation tripDayAccommodation = findAccommodationById(logPrefix, accommodationId);
        tripDayAccommodation.setCheckIn(checkIn);

        log.info("{} :: Updated Accommodation check-in with id {} to {}.", logPrefix, accommodationId, checkIn);

        return TripDayWsMapper.createAccommodationTripDayWsDto(ACCOMMODATION_UPDATED_CHECK_IN, accommodationRepository.save(tripDayAccommodation));
    }

    private TripDayWsDto updateCheckOut(ZonedDateTime checkOut, Long accommodationId) {
        String logPrefix = "WsAccommodationUpdateCheckOut";

        TripDayAccommodation tripDayAccommodation = findAccommodationById(logPrefix, accommodationId);
        tripDayAccommodation.setCheckOut(checkOut);

        log.info("{} :: Updated Accommodation check-out with id {} to {}.", logPrefix, accommodationId, checkOut);

        return TripDayWsMapper.createAccommodationTripDayWsDto(ACCOMMODATION_UPDATED_CHECK_OUT, accommodationRepository.save(tripDayAccommodation));
    }

    private TripDayWsDto updateNotes(String notes, Long accommodationId) {
        String logPrefix = "WsAccommodationUpdateNotes";

        TripDayAccommodation tripDayAccommodation = findAccommodationById(logPrefix, accommodationId);
        tripDayAccommodation.setNotes(notes);

        log.info("{} :: Updated Accommodation notes with id {} to {}.", logPrefix, accommodationId, notes);

        return TripDayWsMapper.createAccommodationTripDayWsDto(ACCOMMODATION_UPDATED_NOTES, accommodationRepository.save(tripDayAccommodation));
    }

    @Transactional
    @Override
    public TripDayWsDto delete(Long accommodationId) {
        String logPrefix = "WsAccommodationDelete";

        accommodationRepository.delete(
                findAccommodationById(logPrefix, accommodationId)
        );

        log.info("{} :: Deleted Accommodation with id {}.", logPrefix, accommodationId);

        return TripDayWsMapper.createDeleteAccommodationTripDayWsDto(ACCOMMODATION_DELETED, accommodationId);
    }

    private TripDay findTripDayById(String logPrefix, Long tripDayId) {
        return tripDayRepository.findById(tripDayId)
                .orElseThrow(() -> {
                    log.warn("{} :: TripDay not found with the id {}.", logPrefix, tripDayId);
                    return new TripDayNotFoundException("Day not found.");
                });
    }

    private TripDay findTripDayByIdWithTrip(String logPrefix, Long tripDayId) {
        return tripDayRepository.findTripDayById(tripDayId)
                .orElseThrow(() -> {
                    log.warn("{} :: TripDay not found with the id {}.", logPrefix, tripDayId);
                    return new TripDayNotFoundException("Day not found.");
                });
    }

    private TripDayAccommodation findAccommodationById(String logPrefix, Long accommodationId) {
        return accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> {
                    log.warn("{} :: Accommodation not found with the id {}.", logPrefix, accommodationId);
                    return new TripDayAccommodationNotFoundException("Accommodation not found.");
                });
    }
}
