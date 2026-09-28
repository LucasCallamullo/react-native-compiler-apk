package com.vg.file.controller;

import com.vg.file.dto.request.FileRequestDTO;
import com.vg.file.dto.responde.FileResponseDTO;
import com.vg.file.service.FileService;
import com.vg.shared.exception.AppException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for managing file operations.
 * All endpoints are prefixed with /api/v1/files.
 */
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    /**
     * Creates a new file.
     *
     * @param dto the file data transfer object containing the file details
     * @return ResponseEntity containing the created file data with HTTP 201 Created status
     * @throws AppException if a file with the same name already exists (HTTP 409 Conflict)
     * @throws AppException if the referenced user does not exist (HTTP 404 Not Found)
     */
    @PostMapping
    public ResponseEntity<FileResponseDTO> createFile(@Valid @RequestBody FileRequestDTO dto) {
        FileResponseDTO file = fileService.createFile(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(file);
    }

    /**
     * Retrieves a file by its ID.
     *
     * @param id the file ID
     * @return ResponseEntity containing the file data with HTTP 200 OK status
     * @throws AppException if file not found (HTTP 404 Not Found)
     */
    @GetMapping("/{id}")
    public ResponseEntity<FileResponseDTO> getFileById(@PathVariable UUID id) {
        FileResponseDTO file = fileService.getFileById(id);
        return ResponseEntity.ok(file);
    }

    /**
     * Retrieves all files in the system.
     *
     * @return ResponseEntity containing a list of all files with HTTP 200 OK status
     */
    @GetMapping
    public ResponseEntity<List<FileResponseDTO>> getAllFiles() {
        List<FileResponseDTO> files = fileService.findAllFiles();
        return ResponseEntity.ok(files);
    }

    /**
     * Updates an existing file.
     *
     * @param id  the file ID to update
     * @param dto the DTO containing the updated file data
     * @return ResponseEntity containing the updated file data with HTTP 200 OK status
     * @throws AppException if file not found (HTTP 404 Not Found)
     * @throws AppException if the new name is already in use by another file (HTTP 409 Conflict)
     */
    @PutMapping("/{id}")
    public ResponseEntity<FileResponseDTO> updateFile(
            @PathVariable UUID id,
            @Valid @RequestBody FileRequestDTO dto) {
        FileResponseDTO file = fileService.updateFile(id, dto);
        return ResponseEntity.ok(file);
    }

    /**
     * Deletes a file by its ID.
     *
     * @param id the file ID to delete
     * @return ResponseEntity with HTTP 204 No Content status if successfully deleted
     * @throws AppException if file not found (HTTP 404 Not Found)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable UUID id) {
        fileService.delete(id);
        return ResponseEntity.noContent().build();
    }
}