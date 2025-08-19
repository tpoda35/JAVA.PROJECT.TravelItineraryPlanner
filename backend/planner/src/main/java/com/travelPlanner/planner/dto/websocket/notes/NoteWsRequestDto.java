package com.travelPlanner.planner.dto.websocket.notes;

import com.travelPlanner.planner.Enum.NoteWsType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoteWsRequestDto {

    @NotNull(message = "Type is required.")
    @Enumerated(EnumType.STRING)
    private NoteWsType type;
    private String content;

}
