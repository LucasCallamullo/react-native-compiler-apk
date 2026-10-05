package com.vg.auth.repository;

import com.vg.auth.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {

    Optional<Rol> findByName(String name);

    boolean existsByName(String name);
}