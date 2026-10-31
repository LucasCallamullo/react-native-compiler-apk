package com.vg.caregiver.service;

import com.vg.caregiver.dto.response.CaregiverCodeResponseDTO;
import com.vg.caregiver.dto.response.CaregiverLinkResponseDTO;

import java.util.List;
import java.util.UUID;

public interface CaregiverLinkService {

    /**
     * Creates a new invitation code for the given protected user.
     *
     * @param protectedUserId UUID of the authenticated user (protegido)
     * @return the invitation code (UUID)
     */
    CaregiverCodeResponseDTO generateCode(UUID protectedUserId);

    /**
     * Accepts an invitation code by the authenticated caregiver.
     *
     * @param code           the UUID of the invitation
     * @param caregiverId    UUID of the authenticated user (caregiver)
     * @return the updated link DTO
     */
    CaregiverLinkResponseDTO acceptCode(UUID code, UUID caregiverId);

    /**
     * Revokes a caregiver link by the protected user.
     *
     * @param linkId          UUID of the link
     * @param protectedUserId UUID of the authenticated user
     */
    void revoke(UUID linkId, UUID protectedUserId);

    /**
     * Lists all caregiver links of a protected user.
     *
     * @param protectedUserId UUID of the authenticated user
     * @return list of caregiver links
     */
    List<CaregiverLinkResponseDTO> listByProtected(UUID protectedUserId);

    /**
     * Lists all caregiver links accepted by a caregiver.
     *
     * @param caregiverId UUID of the authenticated user
     * @return list of caregiver links
     */
    List<CaregiverLinkResponseDTO> listByCaregiver(UUID caregiverId);
}