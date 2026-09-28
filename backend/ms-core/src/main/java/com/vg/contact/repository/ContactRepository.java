package com.vg.contact.repository;

import com.vg.contact.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContactRepository extends JpaRepository<Contact, UUID> {

    /**
     * Finds all contacts belonging to a specific user.
     *
     * @param userId the user's UUID
     * @return list of contacts owned by the user
     */
    List<Contact> findByUserId(UUID userId);

    /**
     * Checks if a contact exists with the given email for a specific user.
     * Useful to prevent duplicate contacts per user.
     *
     * @param email the contact email
     * @param userId the user UUID
     * @return true if the contact exists
     */
    boolean existsByEmailAndUserId(String email, UUID userId);
}
