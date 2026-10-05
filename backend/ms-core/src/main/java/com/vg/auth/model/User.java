package com.vg.auth.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email"),
    @UniqueConstraint(columnNames = "dni")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "roles")
@EqualsAndHashCode(exclude = "roles")
public class User {

    @Id
    // @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, unique = true, length = 20)
    private String dni;

    @Column(length = 20)
    private String phone;

    /**
     * Roles assigned to this user.
     * Using explicit join entity (UserRoles) instead of @ManyToMany
     * to allow future metadata on the relationship.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<UserRoles> roles = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Ensures an ID is assigned before the entity is persisted.
     * 
     * Why this exists:
     * - We removed @GeneratedValue(strategy = GenerationType.UUID) to have full control
     *   over the generated ID. With @GeneratedValue, Hibernate always generates a new UUID,
     *   ignoring any manually assigned one (which breaks seeding with fixed UUIDs).
     * - This @PrePersist callback runs right before the INSERT is executed.
     *   If no ID was provided, a random UUID is generated (the common case for normal user creation).
     *   If an ID was provided (e.g., seeded test users with fixed UUIDs), it is respected as-is.
     * 
     * Common cases:
     * - Normal user creation: id is null → generate a random UUID.
     * - Seeded users: id is set explicitly → keep the provided UUID.
     */
    @PrePersist
    public void ensureId() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }
}