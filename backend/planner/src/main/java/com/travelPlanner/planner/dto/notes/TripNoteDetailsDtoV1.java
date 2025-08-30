package com.travelPlanner.planner.dto.notes;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripNoteDetailsDtoV1 implements Serializable {

    private Long id;
    private String content;

    @Serial
    private static final long serialVersionUID = 1L;

}
