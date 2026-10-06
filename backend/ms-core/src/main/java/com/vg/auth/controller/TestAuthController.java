package com.vg.auth.controller;

import com.vg.auth.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Temporary test controller for verifying Spring Security integration:
 * - JWT authentication
 * - Role-based authorization via @PreAuthorize
 * - Access to the authenticated principal via @AuthenticationPrincipal
 * 
 * DELETE BEFORE PRODUCTION.
 */
@RestController
@RequestMapping("/api/v1/test-auth")
public class TestAuthController {

    // ============================================
    // PUBLIC (no token required)
    // ============================================

    /**
     * Public endpoint. Should be accessible without any token.
     * GET /api/v1/test-auth/public
     */
    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> publicEndpoint() {
        return ResponseEntity.ok(Map.of(
            "message", "Public endpoint. No authentication required.",
            "authenticated", false
        ));
    }

    // ============================================
    // AUTHENTICATED (any valid token)
    // ============================================

    /**
     * Any authenticated user can access this, regardless of role.
     * Requires a valid Bearer token.
     * GET /api/v1/test-auth/authenticated
     */
    @GetMapping("/authenticated")
    public ResponseEntity<Map<String, Object>> authenticatedEndpoint(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(Map.of(
            "message", "You are authenticated.",
            "userId", principal.getUserId(),
            "email", principal.getEmail(),
            "roles", principal.getRoles()
        ));
    }

    // ============================================
    // ROLE: USER
    // ============================================

    /**
     * Only users with ROLE_USER can access this.
     * GET /api/v1/test-auth/user
     */
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> userEndpoint(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(Map.of(
            "message", "You have ROLE_USER.",
            "userId", principal.getUserId(),
            "roles", principal.getRoles()
        ));
    }

    // ============================================
    // ROLE: ADMIN
    // ============================================

    /**
     * Only users with ROLE_ADMIN can access this.
     * GET /api/v1/test-auth/admin
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> adminEndpoint(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(Map.of(
            "message", "You have ROLE_ADMIN.",
            "userId", principal.getUserId(),
            "roles", principal.getRoles()
        ));
    }

    // ============================================
    // MULTI-ROLE (USER or ADMIN)
    // ============================================

    /**
     * Users with EITHER ROLE_USER OR ROLE_ADMIN can access this.
     * GET /api/v1/test-auth/user-or-admin
     */
    @GetMapping("/user-or-admin")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> userOrAdminEndpoint(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(Map.of(
            "message", "You have ROLE_USER or ROLE_ADMIN.",
            "userId", principal.getUserId(),
            "roles", principal.getRoles()
        ));
    }

    /**
     * Users with BOTH ROLE_USER AND ROLE_ADMIN can access this.
     * GET /api/v1/test-auth/user-and-admin
     */
    @GetMapping("/user-and-admin")
    @PreAuthorize("hasRole('USER') and hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> userAndAdminEndpoint(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(Map.of(
            "message", "You have BOTH ROLE_USER and ROLE_ADMIN.",
            "userId", principal.getUserId(),
            "roles", principal.getRoles()
        ));
    }

    // ============================================
    // PRINCIPAL vs AUTHENTICATION
    // ============================================

    /**
     * Shows two ways to access the authenticated user:
     * - @AuthenticationPrincipal UserPrincipal (typed, clean)
     * - Authentication (generic, contains principal + authorities)
     * GET /api/v1/test-auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(
            @AuthenticationPrincipal UserPrincipal principal,
            Authentication authentication) {

        Map<String, Object> response = new HashMap<>();
        response.put("userId (from UserPrincipal)", principal.getUserId());
        response.put("email (from UserPrincipal)", principal.getEmail());
        response.put("roles (from UserPrincipal)", principal.getRoles());

        response.put("name (from Authentication)", authentication.getName());
        response.put("authorities (from Authentication)",
            authentication.getAuthorities().stream()
                .map(Object::toString)
                .toList());

        return ResponseEntity.ok(response);
    }

    // ============================================
    // AUTHORITY vs ROLE
    // ============================================

    /**
     * Same as hasRole('ADMIN'), but expressed as hasAuthority.
     * hasAuthority expects the full name INCLUDING the "ROLE_" prefix.
     * GET /api/v1/test-auth/admin-by-authority
     */
    @GetMapping("/admin-by-authority")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Object>> adminByAuthority(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(Map.of(
            "message", "You reached ADMIN via hasAuthority (full name with prefix).",
            "userId", principal.getUserId()
        ));
    }

    // ============================================
    // ROLE STRING FROM TOKEN (raw check)
    // ============================================

    /**
     * Manual role check without Spring Security's hasRole.
     * Useful for dynamic or complex conditions.
     * GET /api/v1/test-auth/manual-check
     */
    @GetMapping("/manual-check")
    public ResponseEntity<Map<String, Object>> manualCheck(
            @AuthenticationPrincipal UserPrincipal principal) {

        boolean isAdmin = principal.getRoles().contains("ADMIN");
        boolean isUser = principal.getRoles().contains("USER");

        return ResponseEntity.ok(Map.of(
            "userId", principal.getUserId(),
            "roles", principal.getRoles(),
            "isAdmin", isAdmin,
            "isUser", isUser
        ));
    }
}