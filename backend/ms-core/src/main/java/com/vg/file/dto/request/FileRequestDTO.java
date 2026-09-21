package com.vg.file.dto.request;

import java.util.UUID;

import com.vg.file.model.FileAccessLevel;
import com.vg.file.model.FileType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FileRequestDTO(

    @NotBlank(message = "The name is required")
    @Size(max = 255)
    String name,

    @NotBlank(message = "the extension is required")
    @Size(max = 10)
    String extension,

    @Size(max = 300)
    String description,

    @NotBlank(message = "The type is required")
    FileType type,

    @NotBlank(message = "The type is required")
    FileAccessLevel accessLevel,

    @NotBlank(message = "the extension is required")
    @Size(max = 300)
    String storagePath,

    @NotBlank(message = "the size bytes is required")
    Long sizeBytes,

    @NotNull(message = "The user is required")
    UUID userId

    
    
    ) {

    }
