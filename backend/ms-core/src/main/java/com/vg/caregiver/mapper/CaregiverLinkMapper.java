package com.vg.caregiver.mapper;

import com.vg.auth.model.User;
import com.vg.caregiver.dto.response.CaregiverLinkResponseDTO;
import com.vg.caregiver.model.CaregiverLink;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CaregiverLinkMapper {

    @Mapping(source = "protectedUser.id", target = "protectedUserId")
    @Mapping(source = "protectedUser", target = "protectedUserName", qualifiedByName = "fullName")
    @Mapping(source = "caregiver.id", target = "caregiverId")
    @Mapping(source = "caregiver", target = "caregiverName", qualifiedByName = "fullName")
    CaregiverLinkResponseDTO toResponseDTO(CaregiverLink entity);

    List<CaregiverLinkResponseDTO> toResponseDTOList(List<CaregiverLink> entities);

    @Named("fullName")
    default String fullName(User user) {
        if (user == null) return null;
        String first = user.getFirstName() != null ? user.getFirstName() : "";
        String last = user.getLastName() != null ? user.getLastName() : "";
        String full = (first + " " + last).trim();
        return full.isEmpty() ? user.getEmail() : full;
    }
}