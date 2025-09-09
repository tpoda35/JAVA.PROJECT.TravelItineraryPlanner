package com.travelPlanner.planner.dto.websocket.note;

import com.travelPlanner.planner.enums.NoteWsType;
import com.travelPlanner.planner.validation.ValidNoteWsRequest;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@ValidNoteWsRequest
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoteWsDto {

    @NotNull(message = "Type is required.")
    @Enumerated(EnumType.STRING)
    private NoteWsType type;
    private Long noteId;
    private String content;

}
