package com.vg.auth.security;

import com.vg.auth.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Custom UserDetails implementation that carries the authenticated user's data.
 * Exposed to controllers via @AuthenticationPrincipal.
 * 
 * Why this exists:
 * - Spring Security uses UserDetails to represent the authenticated principal.
 * - The default User class only carries username/password/authorities.
 * - We need extra fields (userId, email, roles) accessible from controllers
 *   without hitting the database on every request.
 * - The JWT already contains all this data, so we build the principal from it.
 */
public class UserPrincipal implements UserDetails {

    // ============================================
    // FIELDS
    // ============================================

    /**
     * The user's unique identifier (UUID).
     * Extracted from the JWT "sub" claim.
     * Useful for referencing the user in other modules without DB lookups.
     */
    private final UUID userId;

    /**
     * The user's email address.
     * Extracted from the JWT "email" claim.
     * Used as the username for Spring Security.
     */
    private final String email;

    /**
     * The user's role names (e.g., "USER", "ADMIN").
     * Extracted from the JWT "roles" claim.
     * Used to build authorities for @PreAuthorize checks.
     */
    private final List<String> roles;

    // ============================================
    // GETTERS (extra fields, not part of UserDetails)
    // ============================================

    public UUID getUserId() { return userId; }
    public String getEmail() { return email; }
    public List<String> getRoles() { return roles; }

    // ============================================
    // CONSTRUCTORS
    // ============================================

    /**
     * Creates a UserPrincipal with the given authentication data.
     *
     * @param userId the user's UUID
     * @param email the user's email
     * @param roles the user's role names
     */
    public UserPrincipal(UUID userId, String email, List<String> roles) {
        this.userId = userId;
        this.email = email;
        this.roles = roles;
    }

    /**
     * Factory method to build a UserPrincipal from a User entity.
     * Useful when you have the full entity (e.g., during login) and
     * already know the resolved role names.
     *
     * @param user the User entity
     * @param roles the resolved role names
     * @return a new UserPrincipal
     */
    public static UserPrincipal from(User user, List<String> roles) {
        return new UserPrincipal(user.getId(), user.getEmail(), roles);
    }

    // ============================================
    // UserDetails IMPLEMENTATION
    // ============================================

    /**
     * Returns the authorities granted to the user.
     * 
     * Spring Security expects authorities to follow the "ROLE_" prefix convention
     * when using @PreAuthorize("hasRole('ADMIN')"). Without the prefix, hasRole
     * would not match. The prefix is added here so the rest of the codebase
     * can use plain role names ("ADMIN") and stay clean.
     *
     * @return the list of granted authorities
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
            .toList();
    }

    /**
     * Returns the password used to authenticate the user.
     * Always null because authentication is stateless (JWT-based).
     * Spring Security never needs the password after the token is issued.
     */
    @Override public String getPassword() { return null; }

    /**
     * Returns the username used to authenticate the user.
     * We use the email as the username.
     */
    @Override public String getUsername() { return email; }

    /**
     * Indicates whether the user's account has expired.
     * Always true: we don't implement account expiration.
     */
    @Override public boolean isAccountNonExpired() { return true; }

    /**
     * Indicates whether the user is locked.
     * Always true: we don't implement account locking.
     */
    @Override public boolean isAccountNonLocked() { return true; }

    /**
     * Indicates whether the user's credentials (password) have expired.
     * Always true: stateless JWT, credentials are not stored.
     */
    @Override public boolean isCredentialsNonExpired() { return true; }

    /**
     * Indicates whether the user is enabled.
     * Always true: we don't implement user disabling yet.
     * If you add a "disabled" flag on User later, wire it here.
     */
    @Override public boolean isEnabled() { return true; }
}

/*

@RestController
@RequestMapping("/api/v1/contacts")
public class ContactController {

    //! Opción 1: solo el principal
    @GetMapping
    public List<ContactResponseDTO> getMyContacts(@AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal.getUserId();
        return contactService.getByUserId(userId);
    }

    //! Opción 2: con autorización por rol
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ContactResponseDTO> getAllContacts() {
        return contactService.getAll();
    }

    //! Opción 3: con ambos
    @PostMapping
    public ContactResponseDTO create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ContactRequestDTO dto) {
        return contactService.create(principal.getUserId(), dto);
    }
}

*/