package com.vg.auth.mapper;

import com.vg.auth.dto.request.RegisterRequestDTO;
import com.vg.auth.dto.request.UserRequestDTO;
import com.vg.auth.dto.response.UserResponseDTO;
import com.vg.auth.model.User;
import com.vg.auth.model.UserRoles;

import java.util.Set;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(
    componentModel = "spring"
    // nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserMapper {

    // REGISTER: RegisterRequestDTO → User
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User registerToEntity(RegisterRequestDTO dto);

    // UPDATE ALL DATA WITH DTO
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void updateEntity(UserRequestDTO dto, @MappingTarget User user);


    // --------------  MAPPER RESPONSE ---------------
    @Mapping(target = "roles", expression = "java(mapRoles(user.getRoles()))")
    UserResponseDTO toResponseDTO(User user);

    // helper
    default List<String> mapRoles(Set<UserRoles> userRoles) {
        if (userRoles == null || userRoles.isEmpty()) {
            return List.of();
        }
        return userRoles.stream()
            .map(ur -> ur.getRole().getName())
            .toList();
    }
}


/* 

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toEntity(UserRequestDTO dto);



    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(UserRequestDTO dto, @MappingTarget User user);
*/