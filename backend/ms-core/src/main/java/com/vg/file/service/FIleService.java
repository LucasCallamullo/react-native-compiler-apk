package com.vg.file.service;

import java.util.List;
import java.util.UUID;

import com.vg.file.dto.FileRequestDTO;
import com.vg.file.dto.FileResponseDTO;
import com.vg.file.dto.FileUpdateDTO;
import com.vg.file.model.FileType;

public interface FIleService {
        
    FileResponseDTO create(FileRequestDTO dto);

    FileResponseDTO findById(UUID id);

    List<FileResponseDTO> findAll();

    List<FileResponseDTO> findByUserId(UUID userId);

    List<FileResponseDTO> findByUserIdAndType(UUID userId, FileType type);

    List<FileResponseDTO> searchByName(String name);

    FileResponseDTO update(UUID id, FileUpdateDTO dto);

    void delete(UUID id);

    long countByUser(UUID userId);
}
