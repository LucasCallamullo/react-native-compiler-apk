package com.vg.contact.service;

import com.vg.contact.dto.request.ContactRequestDTO;
import com.vg.contact.dto.response.ContactResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ContactService {

    /**
     * Creates a new contact for a specific user.
     *
     * @param dto the contact data (includes userId)
     * @return the created contact
     */
    ContactResponseDTO createContact(ContactRequestDTO dto);

    /**
     * Retrieves a contact by its ID.
     *
     * @param id the contact UUID
     * @return the contact data
     */
    ContactResponseDTO getContactById(UUID id);

    /**
     * Retrieves all contacts for a specific user.
     *
     * @param userId the user UUID
     * @return list of contacts belonging to the user
     */
    List<ContactResponseDTO> getContactsByUserId(UUID userId);

    /**
     * Updates an existing contact.
     *
     * @param id the contact UUID
     * @param dto the updated contact data
     * @return the updated contact
     */
    ContactResponseDTO updateContact(UUID id, ContactRequestDTO dto);

    /**
     * Deletes a contact by its ID.
     *
     * @param id the contact UUID
     * @return true if deleted successfully
     */
    boolean deleteContact(UUID id);
}