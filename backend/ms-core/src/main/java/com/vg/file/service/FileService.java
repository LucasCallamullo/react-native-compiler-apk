package com.vg.file.service;

import java.util.List;
import java.util.UUID;


import com.vg.file.dto.request.FileRequestDTO;
import com.vg.file.dto.responde.FileResponseDTO;
import com.vg.file.model.FileEntity;
import com.vg.file.model.FileType;

public interface FileService {
        
    // VALIDATION METHODS

    void validateNameUniqueForUpdate(String name, UUID id);

    void validateNameUnique(String name);

    FileEntity validateFileExists(UUID id);
    
    // ENTITY METHODS

    FileEntity save(FileEntity file);

    FileEntity getFileEntityById(UUID id);

    // CRUD METHODS

    FileResponseDTO getFileById(UUID id);

    FileResponseDTO createFile(FileRequestDTO dto);

    List<FileResponseDTO> findAllFiles();

    FileResponseDTO updateFile(UUID id, FileRequestDTO dto);

    void delete(UUID id);

}
