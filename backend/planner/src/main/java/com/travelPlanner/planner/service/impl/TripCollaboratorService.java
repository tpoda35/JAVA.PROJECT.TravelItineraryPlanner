package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.invite.InviteWithEmailRequest;
import com.travelPlanner.planner.dto.invite.TripInviteDetailsDtoV1;
import com.travelPlanner.planner.mapper.TripInviteMapper;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.model.TripInvite;
import com.travelPlanner.planner.repository.TripInviteRepository;
import com.travelPlanner.planner.service.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

import static com.travelPlanner.planner.Enum.InviteStatus.PENDING;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripCollaboratorService implements ITripCollaboratorService {

    private final IOwnershipValidationService ownershipValidationService;
    private final IUserService userService;
    private final TripInviteRepository tripInviteRepository;
    private final INotificationService notificationService;
    private final ITripCollaboratorCacheService tripCollaboratorCacheService;
    private final TransactionTemplate transactionTemplate;
    private final ITripCollaboratorCacheService collaboratorCacheService;

    @Transactional
    @Override
    public void inviteWithEmail(Long tripId, InviteWithEmailRequest request) {
        String inviteeUsername = request.getUsername();
        log.debug("Creating trip invite for tripId: {} and username: {}", tripId, inviteeUsername);

        AppUser inviter = userService.getLoggedInUser();
        Trip trip = ownershipValidationService.getTripWithValidation("inviteWithEmail", tripId, inviter.getId());

        AppUser invitee = userService.getByUsername(inviteeUsername);

        LocalDateTime expiresAt = LocalDateTime.now().plusHours(1);

        TripInvite tripInvite = TripInviteMapper.createTripInvite(
                trip,
                inviter,
                invitee,
                expiresAt
        );

        tripInvite = tripInviteRepository.save(tripInvite);
        log.info("Trip invite created with ID: {} for trip: {}", tripInvite.getId(), tripId);

        collaboratorCacheService.evictPendingInvitesByUserId(invitee.getId());

        notificationService.sendToUser(inviteeUsername, "You have a new trip invite!")
                .thenRun(() -> log.info("Notification sent successfully"))
                .exceptionally(ex -> {
                    log.error("Failed to send notification", ex);
                    return null;
                });
    }

    @Async
    @Override
    public CompletableFuture<Page<TripInviteDetailsDtoV1>> getPendingInvitesByLoggedInUser(
            int pageNum, int pageSize
    ) {
        String logPrefix = "getPendingInvitesByLoggedInUser";
        String loggedInUserId = userService.getUserIdFromContextHolder();

        return CompletableFuture.completedFuture(tripCollaboratorCacheService.getOrLoadPendingInvites(loggedInUserId, logPrefix, () ->
                transactionTemplate.execute(status -> {
                    Page<TripInvite> tripInvites = tripInviteRepository.findByInviteeIdAndStatus(
                            loggedInUserId,
                            PENDING,
                            PageRequest.of(pageNum, pageSize)
                    );

                    return TripInviteMapper.fromTripInvitePageToDetailsDtoV1Page(tripInvites);
                }), pageNum, pageSize
        ));
    }
}
