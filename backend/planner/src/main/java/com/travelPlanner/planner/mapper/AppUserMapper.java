package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.model.AppUser;
import org.keycloak.representations.idm.UserRepresentation;

public class AppUserMapper {

    public static AppUser fromKeycloakUserToAppUser(UserRepresentation userRepresentation) {
        return AppUser.builder()
                .id(userRepresentation.getId())
                .username(userRepresentation.getUsername())
                .build();
    }

}
