package com.travelPlanner.planner.filter;

import com.travelPlanner.planner.model.AppUser;
import com.travelPlanner.planner.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class UserPersistenceFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth instanceof JwtAuthenticationToken jwtAuth && auth.isAuthenticated()) {
            Jwt jwt = jwtAuth.getToken();
            String userId = jwt.getSubject();
            String email = jwt.getClaimAsString("email");

            if (!userRepository.existsById(userId)) {
                AppUser appUser = AppUser.builder()
                        .id(userId)
                        .username(email)
                        .build();
                userRepository.save(appUser);
            }
        }

        filterChain.doFilter(request, response);
    }
}
