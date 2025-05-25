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
        String loggedInUserId = getUserIdFromContextHolder();

        return userRepository.findById(loggedInUserId)
                .orElseThrow(() -> {
                    log.warn("getLoggedInUser :: user not found with the id of {}.", loggedInUserId);
                    return new UserNotFoundException("User not found.");
                });
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
}
