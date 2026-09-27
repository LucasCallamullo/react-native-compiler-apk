package com.vg.contact.service.impl;

import com.vg.auth.model.User;
import com.vg.auth.service.UserService;
import com.vg.contact.dto.request.ContactRequestDTO;
import com.vg.contact.dto.response.ContactResponseDTO;
import com.vg.contact.mapper.ContactMapper;
import com.vg.contact.model.Contact;
import com.vg.contact.repository.ContactRepository;
import com.vg.contact.service.ContactService;
import com.vg.shared.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Implementation of ContactService.
 * Handles all contact-related business logic.
 * Reuses UserService to validate the existence of the owner user.
 */
@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final ContactMapper contactMapper;
    // Reutilizamos UserService (ya existente en el módulo auth)
    private final UserService userService;

    @Override
    @Transactional
    public ContactResponseDTO createContact(ContactRequestDTO dto) {
        // Step 1: Validate user exists (reusing existing UserService method)
        User user = userService.validateUserExists(dto.userId());

        // Step 2: Prevent duplicate contact email per user (optional business rule)
        if (contactRepository.existsByEmailAndUserId(dto.email(), dto.userId())) {
            throw new AppException(
                "Contact already exists with email: " + dto.email() + " for this user",
                HttpStatus.CONFLICT
            );
        }

        // Step 3: Map DTO to Entity
        Contact contact = contactMapper.toEntity(dto);

        // Step 4: Attach the managed User entity (avoids transient reference issues)
        contact.setUser(user);

        // Step 5: Save to database
        Contact savedContact = contactRepository.save(contact);

        // Step 6: Return as DTO
        return contactMapper.toResponseDTO(savedContact);
    }

    @Override
    @Transactional(readOnly = true)
    public ContactResponseDTO getContactById(UUID id) {
        Contact contact = findContactOrThrow(id);
        return contactMapper.toResponseDTO(contact);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactResponseDTO> getContactsByUserId(UUID userId) {
        // Validate the user exists before listing (consistent error handling)
        userService.validateUserExists(userId);
        return contactMapper.toResponseDTOList(contactRepository.findByUserId(userId));
    }

    @Override
    @Transactional
    public ContactResponseDTO updateContact(UUID id, ContactRequestDTO dto) {
        // Step 1: Find contact or throw 404
        Contact contact = findContactOrThrow(id);

        // Step 2: If userId changed, validate the new user
        if (!contact.getUser().getId().equals(dto.userId())) {
            User newUser = userService.validateUserExists(dto.userId());
            contact.setUser(newUser);
        }

        // Step 3: Map DTO fields into the existing entity
        contactMapper.updateEntity(dto, contact);

        // Step 4: Save
        Contact updatedContact = contactRepository.save(contact);

        return contactMapper.toResponseDTO(updatedContact);
    }

    @Override
    @Transactional
    public boolean deleteContact(UUID id) {
        Contact contact = findContactOrThrow(id);
        contactRepository.delete(contact);
        return true;
    }

    // ============================================
    // PRIVATE HELPERS
    // ============================================

    /**
     * Finds a contact by ID or throws a 404 AppException.
     *
     * @param id the contact UUID
     * @return the Contact entity
     * @throws AppException with 404 NOT_FOUND if contact doesn't exist
     */
    private Contact findContactOrThrow(UUID id) {
        return contactRepository.findById(id)
            .orElseThrow(() -> new AppException("Contact not found with id: " + id, HttpStatus.NOT_FOUND));
    }
}