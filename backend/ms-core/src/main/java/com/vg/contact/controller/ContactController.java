package com.vg.contact.controller;

import com.vg.contact.dto.request.ContactRequestDTO;
import com.vg.contact.dto.response.ContactResponseDTO;
import com.vg.contact.service.ContactService;
import com.vg.shared.security.Roles;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import com.vg.auth.security.UserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for managing contact operations.
 * All endpoints are prefixed with /api/v1/contacts.
 *
 * Security:
 * - The userId is NEVER received in the URL. It is always extracted from the
 *   authenticated JWT via @AuthenticationPrincipal UserPrincipal.
 * - GET / returns all contacts for ADMIN, or only the authenticated user's contacts otherwise.
 * - GET /{id}, PUT /{id}, DELETE /{id} verify that the contact belongs to the
 *   authenticated user (double-factor check: id + userId from JWT).
 *
 * Note: Responses are automatically wrapped by ApiResponseAdvice.
 */
@RestController
@RequestMapping("/api/v1/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    // ============================================
    // LIST — ADMIN sees all, USER sees own
    // ============================================
    @GetMapping
    public List<ContactResponseDTO> getAllByUserOrRole(
            @AuthenticationPrincipal UserPrincipal principal) {

        UUID userId = principal.getUserId();
        List<String> roles = principal.getRoles();

        if (Roles.isAdmin(roles)) {
            return contactService.getAll();
        }

        return contactService.getByUserId(userId);
    }

    // ============================================
    // CREATE — userId taken from JWT
    // ============================================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponseDTO createContact(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ContactRequestDTO dto) {

        UUID userId = principal.getUserId();
        return contactService.createContact(dto, userId);
    }

    // ============================================
    // GET ONE — id only in URL, userId from JWT
    // ============================================
    @GetMapping("/{id}")
    public ContactResponseDTO getContactById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {

        UUID userId = principal.getUserId();
        return contactService.getContactByIdAndUserId(id, userId);
    }

    // ============================================
    // UPDATE — id only in URL, userId from JWT
    // ============================================
    @PutMapping("/{id}")
    public ContactResponseDTO updateContact(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody ContactRequestDTO dto) {

        UUID userId = principal.getUserId();
        return contactService.updateContact(id, userId, dto);
    }

    // ============================================
    // DELETE — id only in URL, userId from JWT
    // ============================================
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContact(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {

        UUID userId = principal.getUserId();
        contactService.deleteContact(id, userId);
    }
}