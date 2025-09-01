package com.travelPlanner.planner.dto.collaborator;

import com.travelPlanner.planner.Enum.CollaboratorRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripCollaboratorRoleUpdateRequest {

    private CollaboratorRole role;

}
