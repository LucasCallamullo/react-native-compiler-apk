package com.vg.caregiver.service.impl;

import com.vg.auth.model.Rol;
import com.vg.auth.model.User;
import com.vg.auth.model.utils.RolType;
import com.vg.auth.service.RolService;
import com.vg.auth.service.UserService;
import com.vg.caregiver.dto.response.CaregiverCodeResponseDTO;
import com.vg.caregiver.dto.response.CaregiverLinkResponseDTO;
import com.vg.caregiver.mapper.CaregiverLinkMapper;
import com.vg.caregiver.model.CaregiverLink;
import com.vg.caregiver.model.CaregiverLinkStatus;
import com.vg.caregiver.repository.CaregiverLinkRepository;
import com.vg.caregiver.service.CaregiverLinkService;
import com.vg.shared.exception.AppException;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CaregiverLinkServiceImpl implements CaregiverLinkService {

    private final CaregiverLinkRepository caregiverLinkRepository;
    private final CaregiverLinkMapper caregiverLinkMapper;
    private final UserService userService;
    private final RolService rolService;

    // ============================================
    // GENERATE CODE
    // ============================================

    @Override
    @Transactional
    public CaregiverCodeResponseDTO generateCode(UUID protectedUserId) {
        User protectedUser = userService.validateUserExists(protectedUserId);

        CaregiverLink link = CaregiverLink.builder()
            .protectedUser(protectedUser)
            .status(CaregiverLinkStatus.PENDING)
            .build();

        CaregiverLink saved = caregiverLinkRepository.save(link);

        return new CaregiverCodeResponseDTO(saved.getId());
    }

    // ============================================
    // ACCEPT CODE
    // ============================================

    @Override
    @Transactional
    public CaregiverLinkResponseDTO acceptCode(UUID code, UUID caregiverId) {
        User caregiver = userService.validateUserExists(caregiverId);

        CaregiverLink link = caregiverLinkRepository
            .findByIdAndStatus(code, CaregiverLinkStatus.PENDING)
            .orElseThrow(() -> new AppException(
                "Invitation code not found or no longer valid",
                HttpStatus.NOT_FOUND
            ));

        // Prevent self-accept
        if (link.getProtectedUser().getId().equals(caregiver.getId())) {
            throw new AppException(
                "A user cannot accept their own invitation code",
                HttpStatus.BAD_REQUEST
            );
        }

        // Prevent duplicate (already accepted between these two)
        boolean alreadyLinked = caregiverLinkRepository.existsByProtectedUserAndCaregiver(
            link.getProtectedUser(), caregiver, CaregiverLinkStatus.ACCEPTED
        );
        if (alreadyLinked) {
            throw new AppException(
                "This caregiver is already linked to that protected user",
                HttpStatus.CONFLICT
            );
        }

        // Update the link
        link.setCaregiver(caregiver);
        link.setStatus(CaregiverLinkStatus.ACCEPTED);
        link.setAcceptedAt(LocalDateTime.now());
        CaregiverLink saved = caregiverLinkRepository.save(link);

        // Assign CAREGIVER role if the user doesn't have it yet
        assignCaregiverRole(caregiver);

        return caregiverLinkMapper.toResponseDTO(saved);
    }

    // ============================================
    // REVOKE
    // ============================================

    @Override
    @Transactional
    public void revoke(UUID linkId, UUID protectedUserId) {
        CaregiverLink link = caregiverLinkRepository.findById(linkId)
            .orElseThrow(() -> new AppException(
                "Caregiver link not found",
                HttpStatus.NOT_FOUND
            ));

        if (!link.getProtectedUser().getId().equals(protectedUserId)) {
            throw new AppException(
                "Only the protected user can revoke this link",
                HttpStatus.FORBIDDEN
            );
        }

        if (link.getStatus() == CaregiverLinkStatus.REVOKED) {
            throw new AppException(
                "This link is already revoked",
                HttpStatus.CONFLICT
            );
        }

        link.setStatus(CaregiverLinkStatus.REVOKED);
        link.setRevokedAt(LocalDateTime.now());
        link.setRevokedBy(link.getProtectedUser());
        caregiverLinkRepository.save(link);
    }

    // ============================================
    // LIST
    // ============================================

    @Override
    @Transactional(readOnly = true)
    public List<CaregiverLinkResponseDTO> listByProtected(UUID protectedUserId) {
        userService.validateUserExists(protectedUserId);
        return caregiverLinkMapper.toResponseDTOList(
            caregiverLinkRepository.findByProtectedUserIdWithCaregiver(protectedUserId)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CaregiverLinkResponseDTO> listByCaregiver(UUID caregiverId) {
        userService.validateUserExists(caregiverId);
        return caregiverLinkMapper.toResponseDTOList(
            caregiverLinkRepository.findByCaregiverIdWithProtected(caregiverId)
        );
    }

    // ============================================
    // HELPERS
    // ============================================

    private void assignCaregiverRole(User caregiver) {
        // Only assign if not already present
        Rol caregiverRole = rolService.findByNameOrThrow(RolType.CAREGIVER.name());

        boolean alreadyHasIt = caregiver.getRoles().stream()
            .anyMatch(ur -> ur.getRole().getId().equals(caregiverRole.getId()));

        if (!alreadyHasIt) {
            rolService.saveRoles(caregiver, List.of(caregiverRole));
        }
    }
}