package com.vg.shared.config;

import com.vg.auth.config.UserSeeder;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Central seeder orchestrator.
 * Calls all module seeders in a controlled order, so they can depend on each other.
 * 
 * Order matters:
 * 1. Roles must be seeded first (Users need roles).
 * 2. Users can be seeded after roles.
 * 3. Future modules (contacts, etc.) can reference the seeded users.
 */
@Component
@RequiredArgsConstructor
@Order(1)
public class DaddySeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DaddySeeder.class);

    private final UserSeeder userSeeder;

    @Override
    public void run(String... args) {

        // step 0: 
        // if u need this stupid uuid u can use after seeders rol n user
        UUID userId = UserSeeder.TEST_USER_ID;    // 00000000-0000-0000-0000-000000000001
        String userEmail = UserSeeder.TEST_USER_EMAIL;    // test@gmail.com
        
        UUID adminId = UserSeeder.ADMIN_USER_ID;    // 00000000-0000-0000-0000-000000000002
        String userAdmin = UserSeeder.ADMIN_USER_EMAIL;    // admin@gmail.com


        log.info("=== Starting seed process ===");

        // Step 1: Seed roles (must be first, users depend on them)
        userSeeder.seedRoles();

        // Step 2: Seed users (depends on roles)
        userSeeder.seedUsers();
        userSeeder.seedUsersRoles();

        // Step 3: Future seeders go here, in order
        // contactSeeder.seedContacts();

        log.info("=== Seed process completed ===");
    }
}