package com.vg.auth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Represents a role in the system.
 * Roles are stored in the database instead of being hardcoded as an enum,
 * allowing new roles to be added without code changes.
 */
@Entity
@Table(name = "roles", uniqueConstraints = {
    @UniqueConstraint(columnNames = "name")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique role name (e.g., USER, ADMIN, OTHER).
     * Used for authorization checks in code.
     */
    @Column(nullable = false, unique = true, length = 50)
    private String name;

    /**
     * Human-readable description of what the role grants.
     */
    @Column(length = 255)
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}