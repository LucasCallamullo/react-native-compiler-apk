package com.vg.caregiver.model;

import com.vg.auth.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents the link between a protected user and a caregiver.
 *
 * The `id` (UUID) doubles as the invitation code: it's opaque,
 * unguessable, and unique.
 */
@Entity
@Table(name = "caregiver_links")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaregiverLink {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "protected_id", nullable = false)
    private User protectedUser;

    // null until someone accepts the code
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caregiver_id")
    private User caregiver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CaregiverLinkStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "revoked_by")
    private User revokedBy;

    @PrePersist
    public void ensureDefaults() {
        if (status == null) {
            status = CaregiverLinkStatus.PENDING;
        }
    }
}