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

    // Ignoramos "user" e "id": el servicio los setea manualmente
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Contact toEntity(ContactRequestDTO dto);

    // user.id (UUID) → userId (UUID)
    @Mapping(source = "user.id", target = "userId")
    ContactResponseDTO toResponseDTO(Contact entity);

    List<ContactResponseDTO> toResponseDTOList(List<Contact> entities);

    // Ignoramos "user" e "id" en update
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(ContactRequestDTO dto, @MappingTarget Contact entity);
}