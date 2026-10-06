package com.vg.contact.service.impl;

import com.vg.auth.model.User;
import com.vg.auth.service.UserService;
import com.vg.contact.dto.request.ContactRequestDTO;
import com.vg.contact.dto.response.ContactResponseDTO;
import com.vg.contact.mapper.ContactMapper;
import com.vg.contact.model.Contact;
import com.vg.contact.repository.ContactRepository;
import com.vg.shared.exception.AppException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link ContactServiceImpl}.
 *
 * Validates the business logic of the contact module in isolation.
 * All external dependencies (repository, mapper, user service) are mocked.
 *
 * Testing approach:
 * - AAA pattern (Arrange - Act - Assert)
 * - Mockito for dependency isolation
 * - AssertJ for fluent assertions
 * - @Nested classes for grouping tests by method
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ContactServiceImpl Unit Tests")
class ContactServiceImplTest {

    // ============================================
    // MOCKS (dependencies to be mocked)
    // ============================================

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private ContactMapper contactMapper;

    @Mock
    private UserService userService;

    // ============================================
    // SYSTEM UNDER TEST (SUT)
    // ============================================

    @InjectMocks
    private ContactServiceImpl contactService;

    // ============================================
    // TEST FIXTURES (reusable test data)
    // ============================================

    private UUID userId;
    private Long contactId;
    private User user;
    private Contact contact;
    private ContactRequestDTO requestDTO;
    private ContactResponseDTO responseDTO;

    /**
     * Initializes common test data before each test.
     */
    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        contactId = 1L;

        user = User.builder()
            .id(userId)
            .firstName("Test")
            .lastName("User")
            .email("test@example.com")
            .password("encodedPassword")
            .dni("12345678")
            .phone("1123456789")
            .build();

        contact = Contact.builder()
            .id(contactId)
            .name("María López")
            .email("maria@example.com")
            .phone("1123456789")
            .user(user)
            .createdAt(LocalDateTime.now())
            .build();

        requestDTO = new ContactRequestDTO(
            "María López",
            "maria@example.com",
            "1123456789"
        );

        responseDTO = new ContactResponseDTO(
            contactId,
            "María López",
            "maria@example.com",
            "1123456789",
            userId,
            LocalDateTime.now()
        );
    }

    // ============================================================
    // CREATE CONTACT
    // ============================================================

    @Nested
    @DisplayName("createContact() tests")
    class CreateContactTests {

        @Test
        @DisplayName("Should create contact successfully when all data is valid")
        void shouldCreateContactSuccessfully() {
            // Arrange
            when(userService.validateUserExists(userId)).thenReturn(user);
            when(contactRepository.existsByEmailAndUserId(requestDTO.email(), userId))
                    .thenReturn(false);
            when(contactMapper.toEntity(requestDTO)).thenReturn(contact);
            when(contactRepository.save(any(Contact.class))).thenReturn(contact);
            when(contactMapper.toResponseDTO(contact)).thenReturn(responseDTO);

            // Act
            ContactResponseDTO result = contactService.createContact(requestDTO, user.getId());

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.id()).isEqualTo(contactId);
            assertThat(result.name()).isEqualTo("María López");
            assertThat(result.email()).isEqualTo("maria@example.com");
            assertThat(result.userId()).isEqualTo(userId);

            // Verify interactions
            verify(userService, times(1)).validateUserExists(userId);
            verify(contactRepository, times(1))
                    .existsByEmailAndUserId(requestDTO.email(), userId);
            verify(contactMapper, times(1)).toEntity(requestDTO);
            verify(contactRepository, times(1)).save(any(Contact.class));
            verify(contactMapper, times(1)).toResponseDTO(contact);
        }

        @Test
        @DisplayName("Should assign the user to the contact before saving")
        void shouldAssignUserToContactBeforeSaving() {
            // Arrange
            when(userService.validateUserExists(userId)).thenReturn(user);
            when(contactRepository.existsByEmailAndUserId(anyString(), any(UUID.class)))
                    .thenReturn(false);
            when(contactMapper.toEntity(requestDTO)).thenReturn(contact);
            when(contactRepository.save(any(Contact.class))).thenReturn(contact);
            when(contactMapper.toResponseDTO(contact)).thenReturn(responseDTO);

            ArgumentCaptor<Contact> contactCaptor = ArgumentCaptor.forClass(Contact.class);

            // Act
            contactService.createContact(requestDTO, user.getId());

            // Assert
            verify(contactRepository).save(contactCaptor.capture());
            Contact savedContact = contactCaptor.getValue();
            assertThat(savedContact.getUser()).isEqualTo(user);
        }

        @Test
        @DisplayName("Should throw AppException 404 when user does not exist")
        void shouldThrowWhenUserDoesNotExist() {
            // Arrange
            when(userService.validateUserExists(userId))
                    .thenThrow(new AppException("User not found", HttpStatus.NOT_FOUND));

            // Act & Assert
            assertThatThrownBy(() -> contactService.createContact(requestDTO, user.getId()))
                    .isInstanceOf(AppException.class)
                    .hasMessage("User not found")
                    .extracting("status")
                    .isEqualTo(HttpStatus.NOT_FOUND.value());

            verify(contactRepository, never()).save(any(Contact.class));
        }

        @Test
        @DisplayName("Should throw AppException 409 when email already exists for the user")
        void shouldThrowWhenEmailAlreadyExistsForUser() {
            // Arrange
            when(userService.validateUserExists(userId)).thenReturn(user);
            when(contactRepository.existsByEmailAndUserId(requestDTO.email(), userId))
                    .thenReturn(true);

            // Act & Assert
            assertThatThrownBy(() -> contactService.createContact(requestDTO, user.getId()))
                    .isInstanceOf(AppException.class)
                    .hasMessageContaining("Contact already exists with email")
                    .extracting("status")
                    .isEqualTo(HttpStatus.CONFLICT.value());

            verify(contactRepository, never()).save(any(Contact.class));
        }
    }

    // ============================================================
    // GET CONTACT BY ID AND USER ID (double-factor)
    // ============================================================

    @Nested
    @DisplayName("getContactByIdAndUserId() tests")
    class GetContactByIdAndUserIdTests {

        @Test
        @DisplayName("Should return contact when id and userId match")
        void shouldReturnContactWhenIdAndUserIdMatch() {
            // Arrange
            when(contactRepository.findByIdAndUserId(contactId, userId))
                    .thenReturn(Optional.of(contact));
            when(contactMapper.toResponseDTO(contact)).thenReturn(responseDTO);

            // Act
            ContactResponseDTO result = contactService.getContactByIdAndUserId(contactId, userId);

            // Assert
            assertThat(result).isEqualTo(responseDTO);
            verify(contactRepository, times(1)).findByIdAndUserId(contactId, userId);
        }

        @Test
        @DisplayName("Should throw AppException 404 when contact is not found")
        void shouldThrowWhenContactNotFound() {
            // Arrange
            when(contactRepository.findByIdAndUserId(contactId, userId))
                    .thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> contactService.getContactByIdAndUserId(contactId, userId))
                    .isInstanceOf(AppException.class)
                    .hasMessageContaining("Contact not found with id")
                    .extracting("status")
                    .isEqualTo(HttpStatus.NOT_FOUND.value());

            verify(contactMapper, never()).toResponseDTO(any(Contact.class));
        }

        @Test
        @DisplayName("Should throw 404 when id is correct but userId does NOT match (double-factor)")
        void shouldThrowWhenUserIdDoesNotMatch() {
            // Arrange: simulate a fake userId that does not own the contact
            UUID fakeUserId = UUID.randomUUID();
            when(contactRepository.findByIdAndUserId(contactId, fakeUserId))
                    .thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> contactService.getContactByIdAndUserId(contactId, fakeUserId))
                    .isInstanceOf(AppException.class)
                    .hasMessageContaining("Contact not found with id: " + contactId)
                    .extracting("status")
                    .isEqualTo(HttpStatus.NOT_FOUND.value());

            // The repository was queried with both parameters, and it returned empty
            verify(contactRepository, times(1)).findByIdAndUserId(contactId, fakeUserId);
        }
    }

    // ============================================================
    // GET CONTACTS BY USER ID
    // ============================================================

    @Nested
    @DisplayName("getContactsByUserId() tests")
    class GetContactsByUserIdTests {

        @Test
        @DisplayName("Should return list of contacts for an existing user")
        void shouldReturnContactsListForExistingUser() {
            // Arrange
            Contact contact2 = Contact.builder()
                    .id(2L)
                    .name("Juan Pérez")
                    .email("juan@example.com")
                    .phone("1187654321")
                    .user(user)
                    .build();

            List<Contact> contacts = List.of(contact, contact2);

            when(userService.validateUserExists(userId)).thenReturn(user);
            when(contactRepository.findByUserId(userId)).thenReturn(contacts);
            when(contactMapper.toResponseDTOList(contacts))
                    .thenReturn(List.of(responseDTO));

            // Act
            List<ContactResponseDTO> result = contactService.getContactsByUserId(userId);

            // Assert
            assertThat(result).hasSize(1);
            verify(userService).validateUserExists(userId);
            verify(contactRepository).findByUserId(userId);
        }

        @Test
        @DisplayName("Should return empty list when user has no contacts")
        void shouldReturnEmptyListWhenNoContacts() {
            // Arrange
            when(userService.validateUserExists(userId)).thenReturn(user);
            when(contactRepository.findByUserId(userId)).thenReturn(List.of());
            when(contactMapper.toResponseDTOList(List.of())).thenReturn(List.of());

            // Act
            List<ContactResponseDTO> result = contactService.getContactsByUserId(userId);

            // Assert
            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("Should throw AppException 404 when user does not exist")
        void shouldThrowWhenUserNotFound() {
            // Arrange
            when(userService.validateUserExists(userId))
                    .thenThrow(new AppException("User not found", HttpStatus.NOT_FOUND));

            // Act & Assert
            assertThatThrownBy(() -> contactService.getContactsByUserId(userId))
                    .isInstanceOf(AppException.class)
                    .hasMessage("User not found");

            verify(contactRepository, never()).findByUserId(any(UUID.class));
        }
    }

    // ============================================================
    // UPDATE CONTACT
    // ============================================================

    @Nested
    @DisplayName("updateContact() tests")
    class UpdateContactTests {

        @Test
        @DisplayName("Should update contact successfully when user does not change")
        void shouldUpdateContactSuccessfully() {
            // Arrange
            when(contactRepository.findByIdAndUserId(contactId, userId))
                    .thenReturn(Optional.of(contact));

            doNothing().when(contactMapper).updateEntity(requestDTO, contact);

            when(contactRepository.save(contact)).thenReturn(contact);

            when(contactMapper.toResponseDTO(contact)).thenReturn(responseDTO);

            // Act
            ContactResponseDTO result = contactService.updateContact(contactId, userId, requestDTO);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.id()).isEqualTo(contactId);

            verify(userService, never()).validateUserExists(any(UUID.class));
            verify(contactMapper).updateEntity(requestDTO, contact);
            verify(contactRepository).save(contact);
        }

        /* 
        @Test
        @DisplayName("Should validate and set new user when userId changes")
        void shouldValidateNewUserWhenUserIdChanges() {
            // Arrange
            UUID newUserId = UUID.randomUUID();
            User newUser = User.builder().id(newUserId).build();
            ContactRequestDTO updateDTO = new ContactRequestDTO(
                    "María López",
                    "maria@example.com",
                    "1123456789"
            );

            when(contactRepository.findByIdAndUserId(contactId, userId))
                    .thenReturn(Optional.of(contact));

            when(userService.validateUserExists(newUserId)).thenReturn(newUser);

            doNothing().when(contactMapper).updateEntity(updateDTO, contact);
            when(contactRepository.save(contact)).thenReturn(contact);
            when(contactMapper.toResponseDTO(contact)).thenReturn(responseDTO);

            // Act
            contactService.updateContact(contactId, userId, updateDTO);

            // Assert
            assertThat(contact.getUser()).isEqualTo(newUser);
            verify(userService).validateUserExists(newUserId);
        } */

        @Test
        @DisplayName("Should throw AppException 404 when contact is not found")
        void shouldThrowWhenContactNotFoundOnUpdate() {
            // Arrange
            when(contactRepository.findByIdAndUserId(contactId, userId))
                    .thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> contactService.updateContact(contactId, userId, requestDTO))
                    .isInstanceOf(AppException.class)
                    .hasMessageContaining("Contact not found with id")
                    .extracting("status")
                    .isEqualTo(HttpStatus.NOT_FOUND.value());

            verify(contactRepository, never()).save(any(Contact.class));
        }
    }

    // ============================================================
    // DELETE CONTACT
    // ============================================================

    @Nested
    @DisplayName("deleteContact() tests")
    class DeleteContactTests {

        @Test
        @DisplayName("Should delete contact successfully when it exists")
        void shouldDeleteContactSuccessfully() {
            // Arrange
            when(contactRepository.findByIdAndUserId(contactId, userId))
                    .thenReturn(Optional.of(contact));

            // Act
            boolean result = contactService.deleteContact(contactId, userId);

            // Assert
            assertThat(result).isTrue();
            verify(contactRepository).delete(contact);
        }

        @Test
        @DisplayName("Should throw AppException 404 when contact is not found")
        void shouldThrowWhenDeletingNonExistentContact() {
            // Arrange
            when(contactRepository.findByIdAndUserId(contactId, userId))
                    .thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> contactService.deleteContact(contactId, userId))
                    .isInstanceOf(AppException.class)
                    .hasMessageContaining("Contact not found with id")
                    .extracting("status")
                    .isEqualTo(HttpStatus.NOT_FOUND.value());

            verify(contactRepository, never()).delete(any(Contact.class));
        }

        @Test
        @DisplayName("Should throw 404 when id is fake but userId is correct (double-factor)")
        void shouldThrowWhenIdIsFakeOnDelete() {
            // Arrange: fake contactId that does not exist for this user
            Long fakeContactId = 99999L;
            when(contactRepository.findByIdAndUserId(fakeContactId, userId))
                    .thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> contactService.deleteContact(fakeContactId, userId))
                    .isInstanceOf(AppException.class)
                    .hasMessageContaining("Contact not found with id: " + fakeContactId)
                    .extracting("status")
                    .isEqualTo(HttpStatus.NOT_FOUND.value());

            verify(contactRepository, never()).delete(any(Contact.class));
        }
    }
}