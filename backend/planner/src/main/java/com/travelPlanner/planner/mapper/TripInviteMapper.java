package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.invite.TripInviteDetailsDtoV1;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.model.TripInvite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.time.LocalDateTime;
import java.util.List;

import static com.travelPlanner.planner.Enum.InviteStatus.PENDING;

public class TripInviteMapper {

    public static TripInvite createTripInvite(
            Trip trip, AppUser inviter, AppUser invitee, LocalDateTime expiresAt
    ) {
        return TripInvite.builder()
                .tripName(trip.getName())
                .trip(trip)
                .inviterUsername(inviter.getUsername())
                .inviter(inviter)
                .inviteeUsername(invitee.getUsername())
                .invitee(invitee)
                .status(PENDING)
                .expiresAt(expiresAt)
                .build();

    }

    public static Page<TripInviteDetailsDtoV1> fromTripInvitePageToDetailsDtoV1Page(Page<TripInvite> tripInvitePage) {
        List<TripInviteDetailsDtoV1> dtoList = tripInvitePage.getContent().stream()
                .map(tripInvite -> TripInviteDetailsDtoV1.builder()
                        .id(tripInvite.getId())
                        .tripName(tripInvite.getTripName())
                        .inviterUsername(tripInvite.getInviterUsername())
                        .inviteeUsername(tripInvite.getInviteeUsername())
                        .status(tripInvite.getStatus())
                        .expiresAt(tripInvite.getExpiresAt())
                        .createdAt(tripInvite.getCreatedAt())
                        .build())
                .toList();

        return new PageImpl<>(dtoList, tripInvitePage.getPageable(), tripInvitePage.getTotalElements());
    }

}
