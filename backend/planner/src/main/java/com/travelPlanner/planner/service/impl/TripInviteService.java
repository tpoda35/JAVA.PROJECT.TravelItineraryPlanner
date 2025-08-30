package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.dto.invite.InviteWithEmailRequest;
import com.travelPlanner.planner.dto.invite.TripInviteDetailsDtoV1;
import com.travelPlanner.planner.exception.CollaboratorAlreadyExistsException;
import com.travelPlanner.planner.mapper.TripInviteMapper;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.model.Trip;
import com.travelPlanner.planner.model.TripCollaborator;
import com.travelPlanner.planner.model.TripInvite;
import com.travelPlanner.planner.repository.TripCollaboratorRepository;
import com.travelPlanner.planner.repository.TripInviteRepository;
import com.travelPlanner.planner.service.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static com.travelPlanner.planner.Enum.CollaboratorRole.VIEWER;
import static com.travelPlanner.planner.Enum.InviteStatus.*;
import static com.travelPlanner.planner.Enum.NotificationType.INVITE;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripInviteService implements ITripInviteService {

    private final IOwnershipValidationService ownershipValidationService;
    private final IUserService userService;
    private final TripInviteRepository tripInviteRepository;
    private final INotificationService notificationService;
    private final TransactionTemplate transactionTemplate;
    private final ITripInviteCacheService collaboratorCacheService;
    private final TripCollaboratorRepository tripCollaboratorRepository;

    @Transactional
    @Override
    public void inviteWithEmail(Long tripId, InviteWithEmailRequest request) {
        String logPrefix = "inviteWithEmail";

        String inviteeUsername = request.getUsername();
        log.debug("{} :: Creating trip invite for tripId: {} and username: {}", logPrefix, tripId, inviteeUsername);

        AppUser inviter = userService.getLoggedInUser();

        // Get the trip, with validation, Folder loaded + Folder -> AppUser loaded + TripCollaborators loaded.
        Trip trip = ownershipValidationService.getTripWithValidation(logPrefix, tripId, inviter.getId());

        AppUser invitee = userService.getByUsername(inviteeUsername);

        if (tripCollaboratorRepository.existsByTripIdAndCollaboratorId(tripId, invitee.getId())) {
            log.info("{} :: User with the id {} already added as a collaborator", logPrefix, invitee.getId());
            throw new CollaboratorAlreadyExistsException("This user already added as a collaborator");
        }

        LocalDateTime expiresAt = LocalDateTime.now().plusHours(1);

        TripInvite tripInvite = TripInviteMapper.createTripInvite(
                trip,
                inviter,
                invitee,
                expiresAt
        );

        tripInvite = tripInviteRepository.save(tripInvite);
        log.info("{} :: Trip invite created with ID: {} for trip: {}", logPrefix, tripInvite.getId(), tripId);

        // Evict cache
        collaboratorCacheService.evictPendingInvitesByUserId(invitee.getId());

        // Send the notification to the invitee
        notificationService.sendToUser(inviteeUsername, TripInviteMapper.fromTripInviteToDetailsDtoV1(tripInvite, trip.getName()), INVITE);
    }

    @Async
    @Override
    public CompletableFuture<Page<TripInviteDetailsDtoV1>> getPendingInvitesByLoggedInUser(
            int pageNum, int pageSize
    ) {
        String logPrefix = "getPendingInvitesByLoggedInUser";
        String loggedInUserId = userService.getUserIdFromContextHolder();

        // This is a Supplier for the cache service, it caches the data if it's not already (if it's cached, then it gives that back)
        return CompletableFuture.completedFuture(collaboratorCacheService.getOrLoadPendingInvites(loggedInUserId, logPrefix, () ->
                transactionTemplate.execute(status -> {
                    Pageable pageReq = PageRequest.of(pageNum, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
                    Page<TripInvite> tripInvites = tripInviteRepository.findByInviteeIdAndStatus(loggedInUserId, PENDING, pageReq);

                    return TripInviteMapper.fromTripInvitePageToDetailsDtoV1Page(tripInvites);
                }), pageNum, pageSize
        ));
    }

    @Transactional
    @Override
    public void acceptInvite(Long inviteId) {
        String logPrefix = "acceptInvite";

        AppUser appUser = userService.getLoggedInUser();
        TripInvite tripInvite = validateAndGetInvite(inviteId, appUser, logPrefix);
        Trip trip = tripInvite.getTrip();

        // Check if user is already a collaborator
        Optional<TripCollaborator> existingCollaborator = tripCollaboratorRepository
                .findByTripIdAndCollaboratorId(trip.getId(), appUser.getId());
        if (existingCollaborator.isPresent()) {
            throw new IllegalStateException("User is already a collaborator on this trip");
        }

        // Update status and create collaborator
        tripInvite.setStatus(ACCEPTED);
        tripInviteRepository.save(tripInvite);

        TripCollaborator tripCollaborator = TripCollaborator.builder()
                .collaborator(appUser)
                .trip(trip)
                .role(VIEWER)
                .build();
        tripCollaboratorRepository.save(tripCollaborator);
    }

    @Transactional
    @Override
    public void declineInvite(Long inviteId) {
        String logPrefix = "declineInvite";

        AppUser appUser = userService.getLoggedInUser();
        TripInvite tripInvite = validateAndGetInvite(inviteId, appUser, logPrefix);

        // Update status
        tripInvite.setStatus(DECLINED);
        tripInviteRepository.save(tripInvite);
    }

    private TripInvite validateAndGetInvite(Long inviteId, AppUser appUser, String logPrefix) {
        // Validate the invite ownership, also load the invitee and trip eagerly
        TripInvite tripInvite = ownershipValidationService.validateTripInviteOwnerShip(logPrefix, inviteId, appUser);

        // Validate invite status
        if (tripInvite.getStatus() != PENDING) {
            throw new IllegalStateException("Invite has already been processed");
        }

        // Check expiration
        if (tripInvite.getExpiresAt() != null && tripInvite.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Invite has expired");
        }

        // Delete cache
        collaboratorCacheService.evictPendingInvitesByUserId(appUser.getId());

        return tripInvite;
    }
}
