package com.vg.auth.repository;

import com.vg.auth.model.UserRoles;
import com.vg.auth.model.utils.UserRolesId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRolesRepository extends JpaRepository<UserRoles, UserRolesId> {

    boolean existsByUserIdAndRoleId(UUID userId, Long roleId);

    void deleteByUserIdAndRoleId(UUID userId, Long roleId);
}