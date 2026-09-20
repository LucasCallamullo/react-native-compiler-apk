package com.vg.file.dto;

import com.vg.file.model.FileType;

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
public class FileUpdateDTO {
        
    @Size(max = 255)
    private String name;

    @Size(max = 10)
    private String extension;

    private FileType type;

    private String description;
}
