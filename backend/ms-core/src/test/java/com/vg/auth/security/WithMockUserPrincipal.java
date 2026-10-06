package com.vg.auth.security;

import org.springframework.security.test.context.support.WithSecurityContext;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Test annotation that populates the SecurityContext with a custom UserPrincipal.
 * 
 * Why this exists:
 * - @WithMockUser (Spring Security default) creates a generic Spring Security User,
 *   not our custom UserPrincipal.
 * - Controllers and services that expect @AuthenticationPrincipal UserPrincipal
 *   would fail with the default mock because the types don't match.
 * - This annotation delegates to WithMockUserPrincipalFactory to build the exact
 *   UserPrincipal we need, with userId, email, and roles.
 * 
 * Usage:
 * 
 *   @Test
 *   @WithMockUserPrincipal(userId = "...", email = "...", roles = {"USER"})
 *   void myTest() {
 *       // SecurityContextHolder.getContext().getAuthentication().getPrincipal()
 *       // returns a UserPrincipal with the values above.
 *   }
 * 
 * Defaults:
 * - userId:  "00000000-0000-0000-0000-000000000001"
 * - email:   "test@mail.com"
 * - roles:   {"USER"}
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = WithMockUserPrincipalFactory.class)
public @interface WithMockUserPrincipal {

    /**
     * The UUID of the authenticated user.
     * Will be parsed into a UUID by the factory.
     */
    String userId() default "00000000-0000-0000-0000-000000000001";

    /**
     * The email of the authenticated user.
     */
    String email() default "test@mail.com";

    /**
     * The roles assigned to the authenticated user.
     * Will be prefixed with "ROLE_" when building authorities.
     */
    String[] roles() default {"USER"};
}