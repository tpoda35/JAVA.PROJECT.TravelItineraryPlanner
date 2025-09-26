package com.travelPlanner.planner.dto.collaborator;

import com.travelPlanner.planner.enums.CollaboratorRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripCollaboratorDetailsDtoV1 {

    private Long collaboratorId;
    private String username;
    private CollaboratorRole role;

}
