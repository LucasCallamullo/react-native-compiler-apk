package com.vg.file.service;

import java.util.List;
import java.util.UUID;


import com.vg.file.dto.request.FileRequestDTO;
import com.vg.file.dto.responde.FileResponseDTO;
import com.vg.file.model.FileType;

public interface FileService {
        
    FileResponseDTO create(FileRequestDTO dto);

    FileResponseDTO findById(UUID fileId);

    List<FileResponseDTO> findAll();

    List<FileResponseDTO> findByUserId(UUID userId);

    List<FileResponseDTO> findByUserIdAndType(UUID userId, FileType type);

    List<FileResponseDTO> searchByName(String name);

    public void validateNameUniqueForUpdate(String name, UUID fileId);

    void validateNameUnique(String name);

    void delete(UUID fileId);

    long countByUser(UUID userId);
}
