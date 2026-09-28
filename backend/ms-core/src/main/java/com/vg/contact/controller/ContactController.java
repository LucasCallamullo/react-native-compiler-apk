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
 * Note: Responses are automatically wrapped by ApiResponseAdvice.
 */
@RestController
@RequestMapping("/api/v1/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    /**
     * Creates a new contact for a specific user.
     *
     * @param dto the contact data (includes userId)
     * @return the created contact data
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponseDTO createContact(@Valid @RequestBody ContactRequestDTO dto) {
        return contactService.createContact(dto);
    }

    /**
     * Retrieves a contact by its ID.
     *
     * @param id the contact UUID
     * @return the contact data
     */
    @GetMapping("/{id}")
    public ContactResponseDTO getContactById(@PathVariable UUID id) {
        return contactService.getContactById(id);
    }

    /**
     * Retrieves all contacts belonging to a specific user.
     *
     * @param userId the user UUID
     * @return list of contacts
     */
    @GetMapping("/user/{userId}")
    public List<ContactResponseDTO> getContactsByUserId(@PathVariable UUID userId) {
        return contactService.getContactsByUserId(userId);
    }

    /**
     * Updates an existing contact.
     *
     * @param id the contact UUID
     * @param dto the updated contact data
     * @return the updated contact data
     */
    @PutMapping("/{id}")
    public ContactResponseDTO updateContact(
            @PathVariable UUID id,
            @Valid @RequestBody ContactRequestDTO dto) {
        return contactService.updateContact(id, dto);
    }

    /**
     * Deletes a contact by its ID.
     *
     * @param id the contact UUID
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContact(@PathVariable UUID id) {
        contactService.deleteContact(id);
    }
}

/*
Importante: Como tienes ApiResponseAdvice activo, NO debes usar ResponseEntity ni envolver en ApiResponse. El advice se encarga de envolver automáticamente. Solo devuelves el DTO directamente.
*/