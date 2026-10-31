package com.vg.caregiver.model;

/**
 * State machine for a CaregiverLink.
 *
 * PENDING  → Created by the protected user, waiting for a caregiver to accept.
 * ACCEPTED → A caregiver has accepted the code; the link is active.
 * REVOKED  → The protected user revoked the link; access is denied.
 *
 * Rows are NEVER deleted: the state is changed instead.
 */
public enum CaregiverLinkStatus {
    PENDING,
    ACCEPTED,
    REVOKED
}