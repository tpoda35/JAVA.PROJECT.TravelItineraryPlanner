package com.travelPlanner.planner.service.impl;

import com.travelPlanner.planner.exception.UserNotFoundException;
import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.repository.UserRepository;
import com.travelPlanner.planner.service.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements IUserService {

    private final UserRepository userRepository;

    @Override
    public String getUserIdFromContextHolder() {
        Map<String, Object> claims = getClaimsFromJwt();

        return (String) claims.get("sub");
    }

    @Override
    public AppUser getLoggedInUser() {
        String logPrefix = "getLoggedInUser";
        String loggedInUserId = getUserIdFromContextHolder();

        return findAppUserById(loggedInUserId, logPrefix);
    }

    @Override
    public AppUser getByUsername(String username) {
        String logPrefix = "getByUsername";

        return findAppUserByUsername(username, logPrefix);
    }

    private Map<String, Object> getClaimsFromJwt() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthorizationDeniedException("Unauthorized, log in again.");
        }

        if (!(authentication instanceof JwtAuthenticationToken jwtToken)) {
            throw new AuthorizationDeniedException("Invalid authentication token.");
        }

        return jwtToken.getToken().getClaims();
    }

    // username is the email
    private AppUser findAppUserByUsername(String username, String logPrefix) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.info("{} :: User not found with the {} username.", logPrefix, username);
                    return new UserNotFoundException("User not found.");
                });
    }

    private AppUser findAppUserById(String loggedInUserId, String logPrefix) {
        return userRepository.findById(loggedInUserId)
                .orElseThrow(() -> {
                    log.warn("{} :: user not found with the id of {}.", logPrefix, loggedInUserId);
                    return new UserNotFoundException("User not found.");
                });
    }
}
