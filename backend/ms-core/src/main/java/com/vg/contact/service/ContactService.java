package com.vg.contact.service;

import com.vg.contact.dto.request.ContactRequestDTO;
import com.vg.contact.dto.response.ContactResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ContactService {

    /**
     * Retrieves all contacts from every user.
     * Intended for ADMIN usage only (authorization is enforced at the controller level).
     */
    List<ContactResponseDTO> getAll();

    /**
     * Retrieves all contacts belonging to a specific user.
     * The userId is extracted from the authenticated JWT, never from user input.
     *
     * @param userId the owner user UUID
     * @return list of contacts belonging to that user
     */
    List<ContactResponseDTO> getByUserId(UUID userId);

    /**
     * Creates a new contact owned by the given user.
     *
     * @param dto    the contact data
     * @param userId the owner user UUID (from JWT)
     * @return the created contact
     */
    ContactResponseDTO createContact(ContactRequestDTO dto, UUID userId);

    /**
     * Retrieves a single contact by its internal id AND the owner user id.
     * Both must match (double-factor check).
     *
     * @param id     the contact Long id
     * @param userId the owner user UUID (from JWT)
     * @return the contact data
     */
    ContactResponseDTO getContactByIdAndUserId(Long id, UUID userId);

    /**
     * Updates a contact identified by id + userId.
     *
     * @param id     the contact Long id
     * @param userId the owner user UUID (from JWT)
     * @param dto    the updated contact data
     * @return the updated contact
     */
    ContactResponseDTO updateContact(Long id, UUID userId, ContactRequestDTO dto);

    /**
     * Deletes a contact identified by id + userId.
     *
     * @param id     the contact Long id
     * @param userId the owner user UUID (from JWT)
     * @return true if deleted successfully
     */
    boolean deleteContact(Long id, UUID userId);
}