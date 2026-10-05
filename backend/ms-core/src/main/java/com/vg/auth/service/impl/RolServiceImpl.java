package com.vg.auth.service.impl;

import com.vg.auth.model.Rol;
import com.vg.auth.model.User;
import com.vg.auth.model.UserRoles;
import com.vg.auth.model.utils.RolType;
import com.vg.auth.model.utils.UserRolesId;
import com.vg.auth.repository.RolRepository;
import com.vg.auth.repository.UserRolesRepository;
import com.vg.auth.service.RolService;
import com.vg.shared.exception.AppException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RolServiceImpl implements RolService {

    private static final Logger log = LoggerFactory.getLogger(RolServiceImpl.class);

    private final RolRepository rolRepository;
    private final UserRolesRepository userRolesRepository;

    @Override
    public Rol findByNameOrThrow(String name) {
        return rolRepository.findByName(name)
            .orElseThrow(() -> new AppException(
                "Role not found with name: " + name,
                HttpStatus.NOT_FOUND
            ));
    }

    @Override
    public List<Rol> assignDefaultRole(User user) {
        return assignRole(user, RolType.USER);
    }

    @Override
    public List<Rol> assignRole(User user, RolType rolType) {
        Rol rol = findByNameOrThrow(rolType.name());
        log.debug("Assigned role {} to user {}", rolType.name(), user.getEmail());
        return List.of(rol);
    }

    @Override
    public List<Rol> assignRoles(User user, List<RolType> rolTypes) {
        if (rolTypes == null || rolTypes.isEmpty()) {
            return assignDefaultRole(user);
        }

        List<Rol> assignedRoles = new ArrayList<>();
        for (RolType rolType : rolTypes) {
            Rol rol = findByNameOrThrow(rolType.name());
            assignedRoles.add(rol);
        }

        log.debug("Assigned {} roles to user {}", assignedRoles.size(), user.getEmail());
        return assignedRoles;
    }

    // ---------------------------------------------------------
    //            SAVE ROLES
    // ---------------------------------------------------------

    @Override
    @Transactional
    public List<UserRoles> saveRoles(User user, List<Rol> roles) {
        if (user.getId() == null) {
            throw new AppException(
                "Cannot save roles for a user without id. Persist the user first.",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        List<UserRoles> userRolesList = roles.stream()
            .map(rol -> UserRoles.builder()
                .id(new UserRolesId(user.getId(), rol.getId()))
                .user(user)
                .role(rol)
                .build())
            .toList();

        List<UserRoles> saved = userRolesRepository.saveAll(userRolesList);

        user.getRoles().addAll(saved);
        
        log.debug("Saved {} UserRoles for user {}", saved.size(), user.getEmail());
        return saved;
    }
}