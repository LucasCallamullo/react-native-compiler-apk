package com.vg.auth.security;

import com.vg.auth.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Filter that intercepts every request, extracts the Bearer token from the
 * Authorization header, validates it, and populates the SecurityContext
 * with a UserPrincipal so controllers can access the authenticated user.
 * 
 * Extends OncePerRequestFilter to guarantee a single execution per request
 * (avoids duplicate processing when the request is internally forwarded).
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Step 1: Read the Authorization header from the request.
        // Expected format: "Bearer <token>"
        String authHeader = request.getHeader("Authorization");

        // Step 2: If there's no header or it doesn't start with "Bearer ",
        // skip authentication and continue the chain.
        // The request is not rejected here: authorization rules in SecurityConfig
        // decide whether the endpoint requires authentication.
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 3: Strip the "Bearer " prefix to get the raw JWT.
        String token = authHeader.substring(BEARER_PREFIX.length());

        // Step 4: Validate the token (signature + expiration).
        // If invalid, skip authentication and continue the chain.
        if (!jwtService.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Step 5: Extract the authenticated user's data from the token claims.
            // - userId: from the "sub" claim
            // - email:  from the "email" claim
            // - roles:  from the "roles" claim
            UUID userId = jwtService.extractUserId(token);
            String email = jwtService.extractEmail(token);
            List<String> roles = jwtService.extractRoles(token);

            // Step 6: Build a UserPrincipal carrying userId, email and roles.
            // This is what controllers will receive via @AuthenticationPrincipal.
            UserPrincipal principal = new UserPrincipal(userId, email, roles);

            // Step 7: Convert role names into Spring Security authorities.
            // The "ROLE_" prefix is required so that @PreAuthorize("hasRole('ADMIN')")
            // matches the authority "ROLE_ADMIN".
            // toUpperCase() is defensive: ensures consistency even if the DB or token
            // store roles in a different case.
            List<SimpleGrantedAuthority> authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .toList();

            // Step 8: Create the Authentication object.
            // - principal: the UserPrincipal (accessible in controllers)
            // - credentials: null (JWT is stateless, no password needed)
            // - authorities: the roles, used by @PreAuthorize
            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(principal, null, authorities);

            // Step 9: Attach request details (IP, session id) to the authentication.
            // Useful for auditing and debugging.
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // Step 10: Store the authentication in the SecurityContext.
            // From this point on, the request is considered authenticated
            // for the current thread. @PreAuthorize and @AuthenticationPrincipal will work.
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            // Step 11: If anything goes wrong while parsing claims (malformed UUID,
            // missing claims, etc.), log it and clear the SecurityContext so the
            // request stays unauthenticated. Do NOT throw here: let the authorization
            // layer decide whether the endpoint allows anonymous access.
            log.warn("Failed to authenticate request: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }

        // Step 12: Continue the filter chain (to the next filter, then the controller).
        filterChain.doFilter(request, response);
    }
}