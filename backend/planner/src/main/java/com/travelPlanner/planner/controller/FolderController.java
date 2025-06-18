package com.travelPlanner.planner.controller;

import com.travelPlanner.planner.dto.folder.FolderCreateDto;
import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV1;
import com.travelPlanner.planner.dto.folder.FolderDetailsDtoV2;
import com.travelPlanner.planner.service.IFolderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/folders")
@Slf4j
@RequiredArgsConstructor
public class FolderController {

    private final IFolderService folderService;

    @GetMapping
    public CompletableFuture<List<FolderDetailsDtoV1>> getFoldersByLoggedInUser() {
        log.info("getFoldersByLoggedInUser :: Endpoint called.");

        return folderService.getFoldersByLoggedInUser();
    }

    @PostMapping
    public ResponseEntity<FolderDetailsDtoV2> addFolderToLoggedInUser(
            @RequestBody @Valid FolderCreateDto folderCreateDto
    ) {
        log.info("addFolderToLoggedInUser :: Endpoint called. Data: {}",folderCreateDto);

        FolderDetailsDtoV2 savedFolder = folderService.addFolderToLoggedInUser(folderCreateDto);
        URI location = URI.create("/folders/" + savedFolder.getId());

        return ResponseEntity.created(location).body(savedFolder);
    }

    @PatchMapping("/rename/{folderId}")
    public FolderDetailsDtoV2 renameFolder(
            @PathVariable("folderId") Long folderId,
            @RequestParam @NotBlank(message = "Folder name cannot be blank.") String newFolderName
    ) {
        log.info("renameTrip :: Endpoint called. Data: folderId: {}, newFolderName: {}.", folderId, newFolderName);

        return folderService.renameFolder(folderId, newFolderName);
    }

    @DeleteMapping("/{folderId}")
    public ResponseEntity<Void> deleteFolder(
            @PathVariable("folderId") Long folderId
    ) {
        log.info("deleteTrip :: Endpoint called. Data: folderId: {}.", folderId);
        folderService.deleteFolder(folderId);

        return ResponseEntity.noContent().build();
    }

}
