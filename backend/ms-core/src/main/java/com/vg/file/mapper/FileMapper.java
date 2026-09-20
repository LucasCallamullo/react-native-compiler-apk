package com.vg.file.mapper;

import com.vg.auth.model.User;
import com.vg.file.dto.*;
import com.vg.file.model.FileEntity;

public class FileMapper {
        public FileEntity toEntity(FileRequestDTO dto, User user) {
        return FileEntity.builder()
                .name(dto.getName())
                .extension(dto.getExtension())
                .user(user)
                .type(dto.getType())
                .description(dto.getDescription())
                .build();
    }

    public FileResponseDTO toResponseDTO(FileEntity entity) {
        return FileResponseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .extension(entity.getExtension())
                .userId(entity.getUser().getId())
                .userName(entity.getUser().getFirstName())   // ajusta según tu entidad User
                .type(entity.getType())
                .description(entity.getDescription())
                .createAt(entity.getCreateAt())
                .updateAt(entity.getUpdateAt())
                .build();
    }

    public void updateEntity(FileEntity entity, FileUpdateDTO dto) {
        if (dto.getName() != null)        entity.setName(dto.getName());
        if (dto.getExtension() != null)   entity.setExtension(dto.getExtension());
        if (dto.getType() != null)        entity.setType(dto.getType());
        if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
    }
}
