package com.vg.file.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.vg.file.model.FileType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder 
public class FileResponseDTO {
    
    private UUID id;
    private String name;
    private String extension;
    private UUID userId;
    private String userName;      // opcional, si quieres mostrar info del dueño
    private FileType type;
    private String description;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
