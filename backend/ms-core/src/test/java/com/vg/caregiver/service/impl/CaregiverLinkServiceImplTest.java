package com.vg.caregiver.service.impl;

import com.vg.auth.model.Rol;
import com.vg.auth.model.User;
import com.vg.auth.model.UserRoles;
import com.vg.auth.model.utils.RolType;
import com.vg.auth.service.RolService;
import com.vg.auth.service.UserService;
import com.vg.caregiver.dto.response.CaregiverCodeResponseDTO;
import com.vg.caregiver.dto.response.CaregiverLinkResponseDTO;
import com.vg.caregiver.mapper.CaregiverLinkMapper;
import com.vg.caregiver.model.CaregiverLink;
import com.vg.caregiver.model.CaregiverLinkStatus;
import com.vg.caregiver.repository.CaregiverLinkRepository;
import com.vg.shared.exception.AppException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CaregiverLinkServiceImpl Unit Tests")
class CaregiverLinkServiceImplTest {

    @Mock private CaregiverLinkRepository caregiverLinkRepository;
    @Mock private CaregiverLinkMapper caregiverLinkMapper;
    @Mock private UserService userService;
    @Mock private RolService rolService;

    @InjectMocks
    private CaregiverLinkServiceImpl service;

    private UUID protectedId;
    private UUID caregiverId;
    private UUID linkId;
    private User protectedUser;
    private User caregiver;
    private CaregiverLink pendingLink;
    private CaregiverLinkResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        protectedId = UUID.randomUUID();
        caregiverId = UUID.randomUUID();
        linkId = UUID.randomUUID();

        protectedUser = User.builder()
            .id(protectedId)
            .firstName("Test")
            .lastName("User")
            .email("test@example.com")
            .password("x")
            .dni("12345678")
            .roles(new HashSet<>())
            .build();

        caregiver = User.builder()
            .id(caregiverId)
            .firstName("Mara")
            .lastName("Care")
            .email("care@example.com")
            .password("x")
            .dni("87654321")
            .roles(new HashSet<>())
            .build();

        pendingLink = CaregiverLink.builder()
            .id(linkId)
            .protectedUser(protectedUser)
            .status(CaregiverLinkStatus.PENDING)
            .build();

        responseDTO = new CaregiverLinkResponseDTO(
            linkId,
            protectedId,
            "Test User",
            caregiverId,
            "Mara Care",
            CaregiverLinkStatus.ACCEPTED,
            LocalDateTime.now(),
            LocalDateTime.now()
        );
    }

    // ============================================================
    // GENERATE CODE
    // ============================================================

    @Nested
    @DisplayName("generateCode() tests")
    class GenerateCodeTests {

        @Test
        @DisplayName("Should create a PENDING link and return the code (UUID)")
        void shouldCreatePendingLinkAndReturnCode() {
            when(userService.validateUserExists(protectedId)).thenReturn(protectedUser);

            // Simulate DB auto-generated UUID on save
            UUID generatedId = UUID.randomUUID();
            when(caregiverLinkRepository.save(any(CaregiverLink.class)))
                .thenAnswer(invocation -> {
                    CaregiverLink linkToSave = invocation.getArgument(0);
                    linkToSave.setId(generatedId);
                    return linkToSave;
                });

            CaregiverCodeResponseDTO result = service.generateCode(protectedId);

            assertThat(result).isNotNull();
            assertThat(result.code()).isNotNull();
            assertThat(result.code()).isEqualTo(generatedId);

            verify(caregiverLinkRepository).save(any(CaregiverLink.class));
        }

        @Test
        @DisplayName("Should throw 404 when protected user does not exist")
        void shouldThrowWhenProtectedUserMissing() {
            when(userService.validateUserExists(protectedId))
                .thenThrow(new AppException("User not found", HttpStatus.NOT_FOUND));

            assertThatThrownBy(() -> service.generateCode(protectedId))
                .isInstanceOf(AppException.class)
                .extracting("status").isEqualTo(HttpStatus.NOT_FOUND.value());

            verify(caregiverLinkRepository, never()).save(any());
        }
    }

    // ============================================================
    // ACCEPT CODE
    // ============================================================

    @Nested
    @DisplayName("acceptCode() tests")
    class AcceptCodeTests {

        @Test
        @DisplayName("Should accept a PENDING link and assign CAREGIVER role")
        void shouldAcceptPendingLink() {
            when(userService.validateUserExists(caregiverId)).thenReturn(caregiver);
            when(caregiverLinkRepository.findByIdAndStatus(linkId, CaregiverLinkStatus.PENDING))
                .thenReturn(Optional.of(pendingLink));
            when(caregiverLinkRepository.existsByProtectedUserAndCaregiver(
                protectedUser, caregiver, CaregiverLinkStatus.ACCEPTED)).thenReturn(false);
            when(caregiverLinkRepository.save(any(CaregiverLink.class)))
                .thenAnswer(inv -> inv.getArgument(0));
            when(caregiverLinkMapper.toResponseDTO(any(CaregiverLink.class))).thenReturn(responseDTO);

            Rol caregiverRol = Rol.builder().id(99L).name(RolType.CAREGIVER.name()).build();
            when(rolService.findByNameOrThrow(RolType.CAREGIVER.name())).thenReturn(caregiverRol);

            CaregiverLinkResponseDTO result = service.acceptCode(linkId, caregiverId);

            assertThat(result).isEqualTo(responseDTO);
            assertThat(pendingLink.getStatus()).isEqualTo(CaregiverLinkStatus.ACCEPTED);
            assertThat(pendingLink.getCaregiver()).isEqualTo(caregiver);

            verify(rolService).saveRoles(eq(caregiver), anyList());
        }

        @Test
        @DisplayName("Should not re-assign CAREGIVER role if already present")
        void shouldNotReassignRole() {
            Rol caregiverRol = Rol.builder().id(99L).name(RolType.CAREGIVER.name()).build();
            UserRoles existing = UserRoles.builder().role(caregiverRol).user(caregiver).build();
            caregiver.getRoles().add(existing);

            when(userService.validateUserExists(caregiverId)).thenReturn(caregiver);
            when(caregiverLinkRepository.findByIdAndStatus(linkId, CaregiverLinkStatus.PENDING))
                .thenReturn(Optional.of(pendingLink));
            when(caregiverLinkRepository.existsByProtectedUserAndCaregiver(
                protectedUser, caregiver, CaregiverLinkStatus.ACCEPTED)).thenReturn(false);
            when(caregiverLinkRepository.save(any(CaregiverLink.class)))
                .thenAnswer(inv -> inv.getArgument(0));
            when(caregiverLinkMapper.toResponseDTO(any(CaregiverLink.class))).thenReturn(responseDTO);
            when(rolService.findByNameOrThrow(RolType.CAREGIVER.name())).thenReturn(caregiverRol);

            service.acceptCode(linkId, caregiverId);

            verify(rolService, never()).saveRoles(any(), anyList());
        }

        @Test
        @DisplayName("Should throw 404 when code is not found or not PENDING")
        void shouldThrowWhenCodeInvalid() {
            when(userService.validateUserExists(caregiverId)).thenReturn(caregiver);
            when(caregiverLinkRepository.findByIdAndStatus(linkId, CaregiverLinkStatus.PENDING))
                .thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.acceptCode(linkId, caregiverId))
                .isInstanceOf(AppException.class)
                .hasMessageContaining("Invitation code not found")
                .extracting("status").isEqualTo(HttpStatus.NOT_FOUND.value());
        }

        @Test
        @DisplayName("Should throw 400 when user tries to accept their own code")
        void shouldThrowWhenSelfAccept() {
            when(userService.validateUserExists(protectedId)).thenReturn(protectedUser);
            when(caregiverLinkRepository.findByIdAndStatus(linkId, CaregiverLinkStatus.PENDING))
                .thenReturn(Optional.of(pendingLink));

            assertThatThrownBy(() -> service.acceptCode(linkId, protectedId))
                .isInstanceOf(AppException.class)
                .extracting("status").isEqualTo(HttpStatus.BAD_REQUEST.value());
        }

        @Test
        @DisplayName("Should throw 409 when caregiver already linked to that protected user")
        void shouldThrowWhenAlreadyLinked() {
            when(userService.validateUserExists(caregiverId)).thenReturn(caregiver);
            when(caregiverLinkRepository.findByIdAndStatus(linkId, CaregiverLinkStatus.PENDING))
                .thenReturn(Optional.of(pendingLink));
            when(caregiverLinkRepository.existsByProtectedUserAndCaregiver(
                protectedUser, caregiver, CaregiverLinkStatus.ACCEPTED)).thenReturn(true);

            assertThatThrownBy(() -> service.acceptCode(linkId, caregiverId))
                .isInstanceOf(AppException.class)
                .extracting("status").isEqualTo(HttpStatus.CONFLICT.value());
        }
    }

    // ============================================================
    // REVOKE
    // ============================================================

    @Nested
    @DisplayName("revoke() tests")
    class RevokeTests {

        @Test
        @DisplayName("Should revoke an ACCEPTED link by the protected user")
        void shouldRevokeAcceptedLink() {
            pendingLink.setStatus(CaregiverLinkStatus.ACCEPTED);
            pendingLink.setCaregiver(caregiver);
            when(caregiverLinkRepository.findById(linkId)).thenReturn(Optional.of(pendingLink));

            service.revoke(linkId, protectedId);

            assertThat(pendingLink.getStatus()).isEqualTo(CaregiverLinkStatus.REVOKED);
            verify(caregiverLinkRepository).save(pendingLink);
        }

        @Test
        @DisplayName("Should throw 403 when caregiver tries to revoke")
        void shouldThrowWhenNotOwner() {
            when(caregiverLinkRepository.findById(linkId)).thenReturn(Optional.of(pendingLink));

            assertThatThrownBy(() -> service.revoke(linkId, caregiverId))
                .isInstanceOf(AppException.class)
                .extracting("status").isEqualTo(HttpStatus.FORBIDDEN.value());
        }

        @Test
        @DisplayName("Should throw 409 when link is already revoked")
        void shouldThrowWhenAlreadyRevoked() {
            pendingLink.setStatus(CaregiverLinkStatus.REVOKED);
            when(caregiverLinkRepository.findById(linkId)).thenReturn(Optional.of(pendingLink));

            assertThatThrownBy(() -> service.revoke(linkId, protectedId))
                .isInstanceOf(AppException.class)
                .extracting("status").isEqualTo(HttpStatus.CONFLICT.value());
        }
    }

    // ============================================================
    // LIST
    // ============================================================

    @Nested
    @DisplayName("list*() tests")
    class ListTests {

        @Test
        @DisplayName("Should list caregiver links of a protected user")
        void shouldListByProtected() {
            when(userService.validateUserExists(protectedId)).thenReturn(protectedUser);
            when(caregiverLinkRepository.findByProtectedUserIdWithCaregiver(protectedId))
                .thenReturn(List.of(pendingLink));
            when(caregiverLinkMapper.toResponseDTOList(anyList())).thenReturn(List.of(responseDTO));

            List<CaregiverLinkResponseDTO> result = service.listByProtected(protectedId);

            assertThat(result).hasSize(1);
        }

        @Test
        @DisplayName("Should list caregiver links of a caregiver")
        void listByCaregiver() {
            when(userService.validateUserExists(caregiverId)).thenReturn(caregiver);
            when(caregiverLinkRepository.findByCaregiverIdWithProtected(caregiverId))
                .thenReturn(List.of(pendingLink));
            when(caregiverLinkMapper.toResponseDTOList(anyList())).thenReturn(List.of(responseDTO));

            List<CaregiverLinkResponseDTO> result = service.listByCaregiver(caregiverId);

            assertThat(result).hasSize(1);
        }
    }
}