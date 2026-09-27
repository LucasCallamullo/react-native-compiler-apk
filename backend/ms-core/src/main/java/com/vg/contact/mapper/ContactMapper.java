package com.vg.contact.mapper;

import com.vg.contact.dto.request.ContactRequestDTO;
import com.vg.contact.dto.response.ContactResponseDTO;
import com.vg.contact.model.Contact;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ContactMapper {

    // Mapea userId (UUID) del DTO al user.id de la entidad
    @Mapping(source = "userId", target = "user.id")
    Contact toEntity(ContactRequestDTO dto);

    // Mapea user.id de la entidad al userId del DTO de respuesta
    @Mapping(source = "user.id", target = "userId")
    ContactResponseDTO toResponseDTO(Contact entity);

    List<ContactResponseDTO> toResponseDTOList(List<Contact> entities);

    // Actualiza una entidad existente desde un DTO
    @Mapping(source = "userId", target = "user.id")
    void updateEntity(ContactRequestDTO dto, @MappingTarget Contact entity);
} 