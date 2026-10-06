package com.vg.contact.service;

import com.vg.contact.dto.request.ContactRequestDTO;
import com.vg.contact.dto.response.ContactResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ContactService {

    List<ContactResponseDTO> getAll();
    List<ContactResponseDTO> getByUserId(UUID userId);

    ContactResponseDTO createContact(ContactRequestDTO dto, UUID userId);

    /**
     * Retrieves a contact by its internal id AND the owner user id.
     * Implements the double-factor security check (id + userId).
     *
     * @param id     the contact Long id
     * @param userId the owner user UUID
     * @return the contact data
     */
    ContactResponseDTO getContactByIdAndUserId(Long id, UUID userId);

    /**
     * Retrieves all contacts for a specific user.
     */
    List<ContactResponseDTO> getContactsByUserId(UUID userId);

    /**
     * Updates a contact identified by id + userId.
     */
    ContactResponseDTO updateContact(Long id, UUID userId, ContactRequestDTO dto);

    /**
     * Deletes a contact identified by id + userId.
     */
    boolean deleteContact(Long id, UUID userId);
}