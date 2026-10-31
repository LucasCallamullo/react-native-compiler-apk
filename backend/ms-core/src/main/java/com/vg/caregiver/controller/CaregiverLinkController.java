package com.vg.caregiver.controller;

import com.vg.auth.security.UserPrincipal;
import com.vg.caregiver.dto.response.CaregiverCodeResponseDTO;
import com.vg.caregiver.dto.response.CaregiverLinkResponseDTO;
import com.vg.caregiver.service.CaregiverLinkService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for CaregiverLink operations.
 * All endpoints are prefixed with /api/v1/caregiver-links.
 *
 * The userId is NEVER received in the URL: it's always extracted from the
 * authenticated JWT via @AuthenticationPrincipal UserPrincipal.
 */
@RestController
@RequestMapping("/api/v1/caregiver-links")
@RequiredArgsConstructor
public class CaregiverLinkController {

    private final CaregiverLinkService caregiverLinkService;

    // ============================================
    // GENERATE CODE — protected user
    // ============================================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CaregiverCodeResponseDTO generateCode(
            @AuthenticationPrincipal UserPrincipal principal) {

        UUID protectedUserId = principal.getUserId();
        return caregiverLinkService.generateCode(protectedUserId);
    }

    // ============================================
    // ACCEPT CODE — caregiver
    // ============================================
    @PostMapping("/{code}/accept")
    public CaregiverLinkResponseDTO acceptCode(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID code) {

        UUID caregiverId = principal.getUserId();
        return caregiverLinkService.acceptCode(code, caregiverId);
    }

    // ============================================
    // REVOKE — protected user
    // ============================================
    @PatchMapping("/{id}/revoke")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revoke(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {

        UUID protectedUserId = principal.getUserId();
        caregiverLinkService.revoke(id, protectedUserId);
    }

    // ============================================
    // LIST MY CAREGIVERS — protected user
    // ============================================
    @GetMapping
    public List<CaregiverLinkResponseDTO> listMyCaregivers(
            @AuthenticationPrincipal UserPrincipal principal) {

        UUID protectedUserId = principal.getUserId();
        return caregiverLinkService.listByProtected(protectedUserId);
    }

    // ============================================
    // LIST WHOM I CARE FOR — caregiver
    // ============================================
    @GetMapping("/caring")
    public List<CaregiverLinkResponseDTO> listCaring(
            @AuthenticationPrincipal UserPrincipal principal) {

        UUID caregiverId = principal.getUserId();
        return caregiverLinkService.listByCaregiver(caregiverId);
    }
}