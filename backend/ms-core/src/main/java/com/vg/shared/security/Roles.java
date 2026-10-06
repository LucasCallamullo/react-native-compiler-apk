package com.vg.shared.security;

import com.vg.auth.model.utils.RolType;

import java.util.List;

/**
 * Centralizes role-related constants and checks.
 * 
 * Why this exists:
 * - Avoid scattering role strings ("ADMIN", "USER") across the codebase.
 * - Provide a single place to change the definition of role-based rules
 *   (e.g., if "admin" also includes "SUPER_ADMIN" in the future).
 * - Keep UserPrincipal and services free of hardcoded role logic.
 * 
 * Usage:
 *   if (Roles.isAdmin(principal.getRoles())) {
 *       return getAll();
 *   }
 */
public final class Roles {

    // ============================================
    // ROLE CONSTANTS
    // ============================================

    public static final String ADMIN = RolType.ADMIN.name();
    public static final String USER  = RolType.USER.name();
    public static final String OTHER = RolType.OTHER.name();

    private Roles() {
        // Utility class: prevent instantiation
    }

    // ============================================
    // ROLE CHECKS
    // ============================================

    /**
     * Centralizes the definition of "admin".
     * If the rule changes (e.g., SUPER_ADMIN also counts),
     * only this method needs to be updated.
     *
     * @param roles the list of role names
     * @return true if the user has the ADMIN role
     */
    public static boolean isAdmin(List<String> roles) {
        return roles != null && roles.contains(ADMIN);
    }

    /**
     * Checks whether the given roles contain the specified role.
     *
     * @param roles the list of role names
     * @param role the role name to check
     * @return true if the role is present
     */
    public static boolean hasRole(List<String> roles, String role) {
        return roles != null && role != null && roles.contains(role);
    }
}