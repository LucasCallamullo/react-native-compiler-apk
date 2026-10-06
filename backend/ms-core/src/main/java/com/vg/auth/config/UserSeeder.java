package com.vg.auth.config;

import com.vg.auth.model.Rol;
import com.vg.auth.model.User;
import com.vg.auth.model.UserRoles;
import com.vg.auth.model.utils.RolType;
import com.vg.auth.model.utils.UserRolesId;
import com.vg.auth.repository.RolRepository;
import com.vg.auth.repository.UserRepository;
import com.vg.auth.repository.UserRolesRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * Seeder for the auth module.
 * Exposes methods to be called by DaddySeeder in a controlled order.
 * 
 * NOT annotated with @Component because it should NOT auto-run.
 * DaddySeeder orchestrates when these methods are called.
 */
@Component
@RequiredArgsConstructor
public class UserSeeder {

    private static final Logger log = LoggerFactory.getLogger(UserSeeder.class);

    // Fixed UUIDs for test/dev users, so other modules can reference them
    public static final UUID TEST_USER_ID  = UUID.fromString("00000000-0000-0000-0000-000000000001");
    public static final String TEST_USER_EMAIL  = "test@gmail.com";

    public static final UUID ADMIN_USER_ID = UUID.fromString("00000000-0000-0000-0000-000000000002");
    public static final String ADMIN_USER_EMAIL  = "admin@gmail.com";

    private final RolRepository rolRepository;
    private final UserRepository userRepository;
    private final UserRolesRepository userRolesRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Seeds the default roles into the database.
     * Idempotent: skips if roles already exist.
     */
    @Transactional
    public void seedRoles() {
        if (rolRepository.count() > 0) {
            log.info("[Roles] Already seeded. Skipping.");
            return;
        }

        List<Rol> defaultRoles = Arrays.stream(RolType.values())
            .map(type -> Rol.builder()
                .name(type.name())
                .description(type.getDescription())
                .build())
            .toList();

        rolRepository.saveAll(defaultRoles);
        log.info("[Roles] Seeded {} default roles.", defaultRoles.size());
    }

    /**
     * Seeds test users with fixed UUIDs for development/testing.
     * Idempotent: skips if the test user already exists.
     */
    @Transactional
    public void seedUsers() {
        if (userRepository.existsById(TEST_USER_ID)) {
            log.info("[Users] Test users already seeded. Skipping.");
            return;
        }

        User testUser = buildUser(
            TEST_USER_ID,
            "Test",
            "User",
            TEST_USER_EMAIL,
            "12345678",
            "1234567890",
            "123456"
        );

        User adminUser = buildUser(
            ADMIN_USER_ID,
            "Mara",
            "Admin",
            ADMIN_USER_EMAIL,
            "87654321",
            "0987654321",
            "123456"
        );

        // Save users and flush so they exist in DB before inserting user_roles
        userRepository.saveAll(List.of(testUser, adminUser));
        userRepository.flush();  // ← FIX

        log.info("[Users] Seeded test user (id={}) and admin user (id={}).", TEST_USER_ID, ADMIN_USER_ID);
    }

    @Transactional
    public void seedUsersRoles() {
        User testUser = userRepository.findById(TEST_USER_ID)
            .orElseThrow(() -> new IllegalStateException(TEST_USER_ID + "USER not seeded"));
        User adminUser = userRepository.findById(ADMIN_USER_ID)
            .orElseThrow(() -> new IllegalStateException(ADMIN_USER_ID + "USER ADMIN not seeded"));

        Rol userRol = rolRepository.findByName(RolType.USER.name())
            .orElseThrow(() -> new IllegalStateException("USER role not seeded"));
        Rol adminRol = rolRepository.findByName(RolType.ADMIN.name())
            .orElseThrow(() -> new IllegalStateException("ADMIN role not seeded"));

        // Assign roles
        UserRoles testUserRole = UserRoles.builder()
            .id(new UserRolesId(testUser.getId(), userRol.getId()))
            .user(testUser)
            .role(userRol)
            .build();

        UserRoles adminUserRole = UserRoles.builder()
            .id(new UserRolesId(adminUser.getId(), adminRol.getId()))
            .user(adminUser)
            .role(adminRol)
            .build();

        UserRoles adminUserRole2 = UserRoles.builder()
            .id(new UserRolesId(adminUser.getId(), userRol.getId()))
            .user(adminUser)
            .role(userRol)
            .build();

        userRolesRepository.saveAll(List.of(testUserRole, adminUserRole, adminUserRole2));
    }

    // ------------------------------------------------------------
    // Helper
    // ------------------------------------------------------------

    private User buildUser(UUID id, String firstName, String lastName, String email,
                           String dni, String cellphone, String rawPassword) {
        return User.builder()
            .id(id)
            .firstName(firstName)
            .lastName(lastName)
            .email(email)
            .password(passwordEncoder.encode(rawPassword))
            .dni(dni)
            .phone(cellphone)
            .build();
    }
}