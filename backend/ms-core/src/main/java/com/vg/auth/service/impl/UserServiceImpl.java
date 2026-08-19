package com.vg.auth.service.impl;

import com.vg.auth.dto.request.UserRequestDTO;
import com.vg.auth.dto.response.UserResponseDTO;
import com.vg.auth.mapper.UserMapper;
import com.vg.auth.model.User;
import com.vg.auth.repository.UserRepository;
import com.vg.auth.service.UserService;
import com.vg.shared.exception.AppException;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND));
    }

    // ==================================== CRUD CONTROLLER =====================================

    @Override
    @Transactional
    public UserResponseDTO createUser(UserRequestDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new AppException("User already exists with email: " + dto.email(), HttpStatus.CONFLICT);
        }

        if (userRepository.existsByDni(dto.dni())) {
            throw new AppException("User already exists with DNI: " + dto.dni(), HttpStatus.CONFLICT);
        }

        User user = userMapper.toEntity(dto);
        User savedUser = userRepository.save(user);
        return userMapper.toResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = getUserEntityById(id);
        return userMapper.toResponseDTO(user);
    }

    @Override
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new AppException("User not found with email: " + email, HttpStatus.NOT_FOUND));
        return userMapper.toResponseDTO(user);
    }

    @Override
    public UserResponseDTO getUserByDni(String dni) {
        User user = userRepository.findByDni(dni)
            .orElseThrow(() -> new AppException("User not found with DNI: " + dni, HttpStatus.NOT_FOUND));
        return userMapper.toResponseDTO(user);
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(userMapper::toResponseDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {
        User user = getUserEntityById(id);

        if (userRepository.existsByEmailAndIdNot(dto.email(), id)) {
            throw new AppException("Email already in use: " + dto.email(), HttpStatus.CONFLICT);
        }

        if (userRepository.existsByDniAndIdNot(dto.dni(), id)) {
            throw new AppException("DNI already in use: " + dto.dni(), HttpStatus.CONFLICT);
        }

        userMapper.updateEntity(dto, user);
        User updatedUser = userRepository.save(user);
        return userMapper.toResponseDTO(updatedUser);
    }

    @Override
    @Transactional
    public boolean deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND);
        }
        userRepository.deleteById(id);
        return true;
    }
}