package com.vg.caregiver.repository;

import com.vg.auth.model.User;
import com.vg.caregiver.model.CaregiverLink;
import com.vg.caregiver.model.CaregiverLinkStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CaregiverLinkRepository extends JpaRepository<CaregiverLink, UUID> {

    /**
     * Finds a CaregiverLink by its invitation code (the UUID) and its status.
     */
    Optional<CaregiverLink> findByIdAndStatus(UUID id, CaregiverLinkStatus status);

    /**
     * Lists all caregiver links created by a protected user, with caregiver loaded.
     */
    @Query("SELECT cl FROM CaregiverLink cl LEFT JOIN FETCH cl.caregiver " +
           "WHERE cl.protectedUser.id = :protectedUserId")
    List<CaregiverLink> findByProtectedUserIdWithCaregiver(@Param("protectedUserId") UUID protectedUserId);

    /**
     * Lists all caregiver links accepted by a caregiver, with protected user loaded.
     */
    @Query("SELECT cl FROM CaregiverLink cl JOIN FETCH cl.protectedUser " +
           "WHERE cl.caregiver.id = :caregiverId")
    List<CaregiverLink> findByCaregiverIdWithProtected(@Param("caregiverId") UUID caregiverId);

    /**
     * Checks if a given user is an ACCEPTED caregiver of another user.
     * Used by ShareLink and other modules to validate CAREGIVERS_ONLY access.
     */
    @Query("SELECT COUNT(cl) > 0 FROM CaregiverLink cl " +
           "WHERE cl.protectedUser = :protectedUser " +
           "AND cl.caregiver = :caregiver " +
           "AND cl.status = :status")
    boolean existsByProtectedUserAndCaregiverAndStatus(
            @Param("protectedUser") User protectedUser,
            @Param("caregiver") User caregiver,
            @Param("status") CaregiverLinkStatus status);

    /**
     * Checks if there is already an ACCEPTED link between two users (in either direction).
     */
    @Query("SELECT COUNT(cl) > 0 FROM CaregiverLink cl " +
           "WHERE cl.protectedUser = :a AND cl.caregiver = :b AND cl.status = :status")
    boolean existsByProtectedUserAndCaregiver(
            @Param("a") User a,
            @Param("b") User b,
            @Param("status") CaregiverLinkStatus status);
}