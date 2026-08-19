package com.vg.auth.model;

/**
 * Defines the available roles for users within the application.
 * Roles determine the level of access and permissions a user has.
 */
public enum UserRole {

    /**
     * Standard user role with basic access to the application.
     * This is the default role assigned to regular users.
     */
    USER,

    /**
     * Administrator role with full system access and elevated permissions.
     * Can manage users, system configurations, and perform administrative operations.
     */
    ADMIN,

    /**
     * Placeholder role reserved for future expansion.
     * May be used for specialized roles such as moderators, managers, or other
     * custom roles that may be defined as the application grows and new
     * business requirements emerge.
     */
    OTHER
}