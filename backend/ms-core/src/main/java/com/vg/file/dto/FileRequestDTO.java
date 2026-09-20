package com.vg.file.dto;

import java.util.UUID;

import com.vg.file.model.FileType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class FileRequestDTO {
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 255)
    private String name;

    @NotBlank(message = "La extensión es obligatoria")
    @Size(max = 10)
    private String extension;

    @NotNull(message = "El usuario es obligatorio")
    private UUID userId;

    @NotNull(message = "El tipo es obligatorio")
    private FileType type;

    
    private String description;

}
