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
 * Reuses UserService to validate the existence of the owner user.
 *
 * Security note:
 * Every "read single / update / delete" operation requires BOTH
 * the contact id (Long) AND the owner user id (UUID) to match.
 * This prevents a user from accessing contacts of another user
 * just by guessing the contact id.
 */
@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final ContactMapper contactMapper;
    private final UserService userService;


    @Transactional(readOnly = true)
    public List<ContactResponseDTO> getAll() {
        return contactRepository.findAll().stream()
            .map(contactMapper::toResponseDTO)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ContactResponseDTO> getByUserId(UUID userId) {
        return contactRepository.findByUserId(userId).stream()
            .map(contactMapper::toResponseDTO)
            .toList();
    }


    @Override
    @Transactional
    public ContactResponseDTO createContact(ContactRequestDTO dto, UUID userId) {
        User user = userService.validateUserExists(userId);

        if (contactRepository.existsByEmailAndUserId(dto.email(), userId)) {
            throw new AppException(
                "Contact already exists with email: " + dto.email() + " for this user",
                HttpStatus.CONFLICT
            );
        }

        Contact contact = contactMapper.toEntity(dto);
        contact.setUser(user);

        Contact savedContact = contactRepository.save(contact);
        return contactMapper.toResponseDTO(savedContact);
    }

    @Override
    @Transactional(readOnly = true)
    public ContactResponseDTO getContactByIdAndUserId(Long id, UUID userId) {
        Contact contact = findContactByIdAndUserIdOrThrow(id, userId);
        return contactMapper.toResponseDTO(contact);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactResponseDTO> getContactsByUserId(UUID userId) {
        userService.validateUserExists(userId);
        return contactMapper.toResponseDTOList(contactRepository.findByUserId(userId));
    }

    @Override
    @Transactional
    public ContactResponseDTO updateContact(Long id, UUID userId, ContactRequestDTO dto) {
        Contact contact = findContactByIdAndUserIdOrThrow(id, userId);

        // Si cambia el dueño del contacto, validar y actualizar
        if (!contact.getUser().getId().equals(userId)) {
            User newUser = userService.validateUserExists(userId);
            contact.setUser(newUser);
        }

        contactMapper.updateEntity(dto, contact);

        Contact updatedContact = contactRepository.save(contact);
        return contactMapper.toResponseDTO(updatedContact);
    }

    @Override
    @Transactional
    public boolean deleteContact(Long id, UUID userId) {
        Contact contact = findContactByIdAndUserIdOrThrow(id, userId);
        contactRepository.delete(contact);
        return true;
    }

    // ============================================
    // PRIVATE HELPERS
    // ============================================

    /**
     * Finds a contact by its internal id AND owner user id.
     * Both must match, implementing the double-factor security check.
     */
    private Contact findContactByIdAndUserIdOrThrow(Long id, UUID userId) {
        return contactRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new AppException(
                "Contact not found with id: " + id + " for user: " + userId,
                HttpStatus.NOT_FOUND
            ));
    }
}