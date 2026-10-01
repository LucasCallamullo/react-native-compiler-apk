package com.vg.contact.controller;

import com.vg.contact.dto.request.ContactRequestDTO;
import com.vg.contact.dto.response.ContactResponseDTO;
import com.vg.contact.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for managing contact operations.
 * All endpoints are prefixed with /api/v1/contacts.
 *
 * Security: read single / update / delete require BOTH id (Long) and userId (UUID)
 * as a double-factor safety mechanism.
 *
 * Note: Responses are automatically wrapped by ApiResponseAdvice.
 */
@RestController
@RequestMapping("/api/v1/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    /**
     * Creates a new contact for a specific user.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponseDTO createContact(@Valid @RequestBody ContactRequestDTO dto) {
        return contactService.createContact(dto);
    }

    /**
     * Retrieves a contact by its id AND the owner user id (double-factor check).
     *
     * Example: GET /api/v1/contacts/1/user/550e8400-e29b-41d4-a716-446655440000
     */
    @GetMapping("/{id}/user/{userId}")
    public ContactResponseDTO getContactByIdAndUserId(
            @PathVariable Long id,
            @PathVariable UUID userId) {
        return contactService.getContactByIdAndUserId(id, userId);
    }

    /**
     * Retrieves all contacts belonging to a specific user.
     */
    @GetMapping("/user/{userId}")
    public List<ContactResponseDTO> getContactsByUserId(@PathVariable UUID userId) {
        return contactService.getContactsByUserId(userId);
    }

    /**
     * Updates a contact identified by id AND owner user id.
     *
     * Example: PUT /api/v1/contacts/1/user/550e8400-e29b-41d4-a716-446655440000
     */
    @PutMapping("/{id}/user/{userId}")
    public ContactResponseDTO updateContact(
            @PathVariable Long id,
            @PathVariable UUID userId,
            @Valid @RequestBody ContactRequestDTO dto) {
        return contactService.updateContact(id, userId, dto);
    }

    /**
     * Deletes a contact identified by id AND owner user id.
     *
     * Example: DELETE /api/v1/contacts/1/user/550e8400-e29b-41d4-a716-446655440000
     */
    @DeleteMapping("/{id}/user/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContact(
            @PathVariable Long id,
            @PathVariable UUID userId) {
        contactService.deleteContact(id, userId);
    }
}
