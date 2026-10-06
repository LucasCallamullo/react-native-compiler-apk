package com.vg.auth.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import java.util.List;
import java.util.UUID;

/**
 * Factory that builds the SecurityContext for @WithMockUserPrincipal.
 * 
 * How it works:
 * - Spring Security Test discovers @WithMockUserPrincipal on a test method or class.
 * - Because the annotation is meta-annotated with @WithSecurityContext(factory = ...),
 *   Spring delegates the context creation to this factory.
 * - This factory builds a UserPrincipal from the annotation's attributes,
 *   wraps it in a UsernamePasswordAuthenticationToken with the proper authorities,
 *   and stores it in a fresh SecurityContext.
 * 
 * The context created here is available for the duration of the test and is
 * automatically cleared after the test completes.
 */
public class WithMockUserPrincipalFactory implements WithSecurityContextFactory<WithMockUserPrincipal> {

    @Override
    public SecurityContext createSecurityContext(WithMockUserPrincipal annotation) {

        // Step 1: Create an empty SecurityContext.
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        // Step 2: Build the UserPrincipal from the annotation's attributes.
        // - userId: parsed from String to UUID
        // - email: used as the username
        // - roles: list of role names (without ROLE_ prefix)
        UUID userId = UUID.fromString(annotation.userId());
        List<String> roles = List.of(annotation.roles());

        UserPrincipal principal = new UserPrincipal(
            userId,
            annotation.email(),
            roles
        );

        // Step 3: Build the Authentication token.
        // - principal: our UserPrincipal
        // - credentials: null (not needed in tests)
        // - authorities: derived from the principal (UserPrincipal.getAuthorities()
        //   adds the ROLE_ prefix automatically)
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            principal,
            null,
            principal.getAuthorities()
        );

        // Step 4: Set the authentication into the context.
        context.setAuthentication(authentication);

        // Step 5: Return the context so Spring can install it for the test.
        return context;
    }
}
