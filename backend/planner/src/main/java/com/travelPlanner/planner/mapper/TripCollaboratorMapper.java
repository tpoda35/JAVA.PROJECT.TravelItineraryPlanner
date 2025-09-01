package com.travelPlanner.planner.mapper;

import com.travelPlanner.planner.dto.collaborator.TripCollaboratorDetailsDtoV1;
import com.travelPlanner.planner.model.TripCollaborator;
import org.springframework.data.domain.Page;

public class TripCollaboratorMapper {

    // To use this it's recommended to eagerly load the AppUser field also in the TripCollaborator.
    public static Page<TripCollaboratorDetailsDtoV1> fromTripCollaboratorPageToDetailsDtoV1(Page<TripCollaborator> tripCollaborators) {
        return tripCollaborators.map(tc -> TripCollaboratorDetailsDtoV1.builder()
                .collaboratorId(tc.getId())
                .username(tc.getCollaborator().getUsername())
                .role(tc.getRole())
                .build()
        );
    }

    // To use this it's recommended to eagerly load the AppUser field also in the TripCollaborator.
    public static TripCollaboratorDetailsDtoV1 fromTripCollaboratorToDetailsDtoV1(TripCollaborator tripCollaborator) {
        return TripCollaboratorDetailsDtoV1.builder()
                .collaboratorId(tripCollaborator.getId())
                .username(tripCollaborator.getCollaborator().getUsername())
                .role(tripCollaborator.getRole())
                .build();
    }
}
