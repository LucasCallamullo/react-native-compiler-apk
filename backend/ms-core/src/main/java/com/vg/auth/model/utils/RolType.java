package com.vg.auth.model.utils;

/**
 * Enum with the default roles available in the system.
 * Used for seeding and for type-safe references to role names.
 * 
 * NOTE: This enum is NOT the source of truth (that's the `roles` table).
 * It's just a convenience to avoid hardcoding strings in Java code.
 */
public enum RolType {

    USER("Standard user with basic access to the application"),
    ADMIN("Administrator with full system access and elevated permissions"),
    OTHER("Placeholder role reserved for future expansion");

    private final String description;

    RolType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
