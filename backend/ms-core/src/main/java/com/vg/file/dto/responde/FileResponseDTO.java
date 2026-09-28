package com.vg.file.dto.responde;

import java.time.LocalDateTime;
import java.util.UUID;

import com.vg.file.model.FileAccessLevel;
import com.vg.file.model.FileType;

public record FileResponseDTO(
    
    UUID id,
    String name,
    String extension,
    String description,
    FileType type,
    String storagePath,
    Long sizeBytes,
    UUID userId,    
    FileAccessLevel accessLevel,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
    ){
    
    }
