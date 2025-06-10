package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.folder.FolderCreateDto;
import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV1;
import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV2;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/folders")
@Slf4j
@RequiredArgsConstructor
public class FolderController {

    @GetMapping
    public CompletableFuture<List<FolderDetailsDtoV1>> getFoldersByLoggedInUser() {
        return null;
    }

    @PostMapping
    public ResponseEntity<FolderDetailsDtoV2> addFolderToLoggedInUser(
            @Valid FolderCreateDto folderCreateDto
    ) {
        return null;
    }

    @PatchMapping("/rename/{folderId}")
    public FolderDetailsDtoV2 renameFolder(
            @PathVariable("folderId") Long folderId
    ) {
        return null;
    }

    @DeleteMapping("/{folderId}")
    public ResponseEntity<Void> deleteFolder(
            @PathVariable("folderId") Long folderId
    ) {
        return ResponseEntity.noContent().build();
    }

}
