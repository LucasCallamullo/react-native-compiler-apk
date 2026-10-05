package com.vg.auth.service;

import com.vg.auth.model.Rol;
import com.vg.auth.model.User;
import com.vg.auth.model.UserRoles;
import com.vg.auth.model.utils.RolType;
import com.vg.shared.exception.AppException;

import java.util.List;

/**
 * Service for managing roles and role assignments.
 */
public interface RolService {

    /**
     * Finds a role by its name, throwing an exception if not found.
     *
     * @param name the role name (e.g., "USER", "ADMIN")
     * @return the role entity
     * @throws AppException with 404 NOT_FOUND if role doesn't exist
     */
    Rol findByNameOrThrow(String name);

    /**
     * Assigns the default USER role to the given user.
     *
     * @param user the user to assign the default role to
     * @return the list of roles assigned
     * @throws AppException with 404 NOT_FOUND if the USER role doesn't exist in DB
     */
    List<Rol> assignDefaultRole(User user);

    /**
     * Assigns a specific role to the given user.
     *
     * @param user the user to assign the role to
     * @param rolType the role type to assign
     * @return the list containing the assigned role
     * @throws AppException with 404 NOT_FOUND if the role doesn't exist in DB
     */
    List<Rol> assignRole(User user, RolType rolType);

    /**
     * Assigns multiple roles to the given user.
     *
     * @param user the user to assign roles to
     * @param rolTypes the list of role types to assign
     * @return the list of roles assigned
     * @throws AppException with 404 NOT_FOUND if any role doesn't exist in DB
     */
    List<Rol> assignRoles(User user, List<RolType> rolTypes);

    /**
     * Persists the UserRoles join entities for the given user and roles.
     * Builds UserRoles entities and saves them in batch.
     *
     * @param user the user to assign roles to (must be persisted, with id)
     * @param roles the roles to assign
     * @return the list of persisted UserRoles entities
     */
    List<UserRoles> saveRoles(User user, List<Rol> roles);
}