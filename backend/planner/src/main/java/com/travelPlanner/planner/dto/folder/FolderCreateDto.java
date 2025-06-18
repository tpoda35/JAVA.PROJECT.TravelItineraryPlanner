package com.travelPlanner.planner.dto.folder;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FolderCreateDto {

    @NotBlank(message = "Name field cannot be empty.")
    private String name;

}
