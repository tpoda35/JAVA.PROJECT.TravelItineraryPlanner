package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.invite.InviteWithEmailRequest;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.model.TripInvite;
import com.travelPlanner.planner.repository.TripInviteRepository;
import com.travelPlanner.planner.repository.UserRepository;
import com.travelPlanner.planner.service.IOwnershipValidationService;
import com.travelPlanner.planner.service.ITripInviteService;
import com.travelPlanner.planner.service.IUserService;
import com.travelPlanner.planner.util.TokenUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static com.travelPlanner.planner.Enum.InviteStatus.PENDING;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripInviteService implements ITripInviteService {

    private final IOwnershipValidationService ownershipValidationService;
    private final IUserService userService;
    private final TripInviteRepository tripInviteRepository;
    private final UserRepository userRepository;

    @Transactional
    @Override
    public String inviteWithEmail(Long tripId, InviteWithEmailRequest request) {
        // loggedInUser  (check if the user has the trip)
        // Find the invited user with the email -> receivedInvites
        // Create a new TripInvite, set trip, inviter, inviteeEmail, invitee, status, inviteToken?, expiresAt.
        // loggedInUser -> sentInvites (set the new TripInvite)
        // invitedUser -> receivedInvites (set the new TripInvite)
        // Save.
        String logPrefix = "inviteWithEmail";

        AppUser inviter = userService.getLoggedInUser();
        Trip trip = ownershipValidationService.getTripWithValidation(logPrefix, tripId, inviter.getId());
        AppUser invitee = userService.getByUsername(request.getUsername());

        TripInvite tripInvite = TripInvite.builder()
                .trip(trip)
                .inviter(inviter)
                .inviteeUsername(request.getUsername())
                .invitee(invitee)
                .status(PENDING)
                .inviteToken(TokenUtil.generateInviteToken())
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build();

        tripInvite = tripInviteRepository.save(tripInvite);

        inviter.getSentInvites().add(tripInvite);
        invitee.getReceivedInvites().add(tripInvite);
        trip.getInvites().add(tripInvite);

        return inviter.getUsername();
    }
}
