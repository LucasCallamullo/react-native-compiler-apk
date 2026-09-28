package com.vg.file.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vg.auth.model.User;
import com.vg.auth.service.impl.UserServiceImpl;
import com.vg.file.dto.request.FileRequestDTO;
import com.vg.file.dto.responde.FileResponseDTO;
import com.vg.file.mapper.FileMapper;
import com.vg.file.model.FileEntity;
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
    private final UserServiceImpl userService;
    
    //VALIDATIONS METHODS
    
    @Override
    public void validateNameUniqueForUpdate(String name, UUID id) {
        if (fileRepository.existsByNameAndIdNot(name, id)) {
            throw new AppException("Name already in use: " + name, HttpStatus.CONFLICT);
        }
    }
    @Override
    public void validateNameUnique(String name) {
        if (fileRepository.existsByName(name)){
            throw new AppException("File already exists with name: " + name, HttpStatus.CONFLICT);
        }
    }
    @Override
    public FileEntity validateFileExists(UUID id) {
        return fileRepository.findById(id)
            .orElseThrow(() -> new AppException("File not found with id: " + id, HttpStatus.NOT_FOUND));
    }

    //ENTITY METHODS

    @Override
    public FileEntity save(FileEntity file) {
        return fileRepository.save(file);
    }
    @Override
    public FileEntity getFileEntityById(UUID id) {
        return validateFileExists(id); 
    }

    //CRUD METHODS

    @Override
    @Transactional(readOnly = true)
    public FileResponseDTO getFileById(UUID id) {
       FileEntity file = validateFileExists(id);
       return fileMapper.toResponseDto(file);
    }
    @Override
    @Transactional 
    public FileResponseDTO createFile(FileRequestDTO dto) {
        
        validateNameUnique(dto.name());

        User user = userService.getUserEntityById(dto.userId());


        FileEntity file = fileMapper.toEntity(dto);
        file.setUser(user);

        FileEntity savedfile = fileRepository.save(file);

        return fileMapper.toResponseDto(savedfile);

    }
    @Override
    @Transactional(readOnly = true)
    public List<FileResponseDTO> findAllFiles() {
        return fileRepository.findAll().stream()
                .map(fileMapper::toResponseDto)
                .collect(Collectors.toList());        
    }
    @Override
    @Transactional 
    public FileResponseDTO updateFile(UUID id, FileRequestDTO dto) {
        
        FileEntity file = validateFileExists(id);

        validateNameUniqueForUpdate(dto.name(), id);

        fileMapper.updateEntity(dto, file);

        FileEntity updateFile = fileRepository.save(file);

        return fileMapper.toResponseDto(updateFile);
    }
    @Override
    public void delete(UUID id) {
        validateFileExists(id);

        fileRepository.deleteById(id);
    }

}
