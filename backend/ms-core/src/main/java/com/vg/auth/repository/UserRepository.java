package com.vg.auth.repository;

import com.vg.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for User entity operations.
 * Extends JpaRepository to provide CRUD and pagination capabilities.
 */
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Finds a user by email with roles eagerly loaded.
     * Use this for authentication (login) when you need to build JWT claims with roles.
     * 
     * @param email the user's email address
     * @return Optional containing the user if found, empty otherwise
     */
    @Query("SELECT u FROM User u " +
           "LEFT JOIN FETCH u.roles ur " +
           "LEFT JOIN FETCH ur.role " +
           "WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(@Param("email") String email);

    @Query("SELECT u FROM User u " +
            "LEFT JOIN FETCH u.roles ur " +
            "LEFT JOIN FETCH ur.role " +
            "WHERE u.id = :id")
    Optional<User> findUserByIdWithRoles(@Param("id") UUID id);

    @Query("SELECT DISTINCT u FROM User u " +
        "LEFT JOIN FETCH u.roles ur " +
        "LEFT JOIN FETCH ur.role")
    List<User> findAllWithRoles();

    /**
     * Finds a user by their email address.
     *
     * @param email the user's email address
     * @return Optional containing the user if found, empty otherwise
     */
    Optional<User> findByEmail(String email);

    /**
     * Finds a user by their DNI (national identification number).
     *
     * @param dni the user's DNI
     * @return Optional containing the user if found, empty otherwise
     */
    Optional<User> findByDni(String dni);

    /**
     * Checks if a user exists with the given email address.
     *
     * @param email the email to check
     * @return true if a user exists with the given email, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Checks if a user exists with the given DNI.
     *
     * @param dni the DNI to check
     * @return true if a user exists with the given DNI, false otherwise
     */
    boolean existsByDni(String dni);

    /**
     * Checks if a user exists with the given email, excluding a specific user ID.
     * Useful for update operations to check if the email is already taken by another user.
     *
     * @param email the email to check
     * @param id the user ID to exclude from the check
     * @return true if a user exists with the given email (excluding the specified ID), false otherwise
     */
    boolean existsByEmailAndIdNot(String email, UUID id);

    /**
     * Checks if a user exists with the given DNI, excluding a specific user ID.
     * Useful for update operations to check if the DNI is already taken by another user.
     *
     * @param dni the DNI to check
     * @param id the user ID to exclude from the check
     * @return true if a user exists with the given DNI (excluding the specified ID), false otherwise
     */
    boolean existsByDniAndIdNot(String dni, UUID id);
}