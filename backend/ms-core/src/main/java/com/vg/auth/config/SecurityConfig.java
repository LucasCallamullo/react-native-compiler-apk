package com.vg.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF (necesario para APIs REST)
            .csrf(csrf -> csrf.disable())
            
            // Configurar políticas de sesión (stateless para JWT)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Configurar autorización de endpoints
            .authorizeHttpRequests(auth -> auth
                /* / Endpoints públicos (sin autenticación)
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/users/**").permitAll()  // Temporalmente público
                .requestMatchers("/h2-console/**").permitAll()    // Para la consola H2
                
                // Cualquier otro endpoint requiere autenticación
                .anyRequest().authenticated() */

                // Todos los endpoints son públicos
                .anyRequest().permitAll()
            )
            
            // Deshabilitar autenticación básica (para que no pida login en el navegador)
            .httpBasic(httpBasic -> httpBasic.disable())
            
            // Permitir frames para la consola H2
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.disable())
            );

        return http.build();
    }
}