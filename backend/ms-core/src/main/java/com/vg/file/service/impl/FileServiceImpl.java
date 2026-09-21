package com.vg.file.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.vg.file.dto.request.FileRequestDTO;
import com.vg.file.dto.responde.FileResponseDTO;
import com.vg.file.mapper.FileMapper;
import com.vg.file.model.FileType;
import com.vg.file.repository.FileRepository;
import com.vg.file.service.FileService;
import com.vg.shared.exception.AppException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileMapper fileMapper;
    private final FileRepository fileRepository;

    @Override 
    public void validateNameUnique(String name) {
        if (fileRepository.existsByName(name)) {
            throw new AppException("The name was registered: " + name, HttpStatus.CONFLICT);
        }
    }

    @Override
    public void validateNameUniqueForUpdate(String name, UUID fileId) {
        if (fileRepository.existsByNameAndIdNot(name, fileId)){
        throw new AppException("Name already is use: " + name, HttpStatus.CONFLICT);
        }
    }

    @Override
    public FileResponseDTO create(FileRequestDTO dto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'create'");
    }

    @Override
    public FileResponseDTO findById(UUID id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }

    @Override
    public List<FileResponseDTO> findAll() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAll'");
    }

    @Override
    public List<FileResponseDTO> findByUserId(UUID userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByUserId'");
    }

    @Override
    public List<FileResponseDTO> findByUserIdAndType(UUID userId, FileType type) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByUserIdAndType'");
    }

    @Override
    public List<FileResponseDTO> searchByName(String name) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'searchByName'");
    }

    @Override
    public void delete(UUID id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

    @Override
    public long countByUser(UUID userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'countByUser'");
    }

    

}
