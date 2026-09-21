package com.vg.file.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import com.vg.file.dto.request.FileRequestDTO;
import com.vg.file.model.FileEntity;

@Mapper(componentModel = "spring")
public interface FileMapper {
 
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    FileEntity toEntity(FileRequestDTO dto);

    @Mapping(target = "userId", source = "user.id")
    FileRequestDTO toResponseDto(FileEntity fileEntity);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(FileRequestDTO dto, @MappingTarget FileEntity fileEntity);
}
