package com.vg.file.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vg.file.model.FileEntity;
import com.vg.file.model.FileType;

public interface FileRepository extends JpaRepository<FileEntity, UUID> {

        // Buscar por nombre exacto
    Optional<FileEntity> findByName(String name);

    // Buscar todos los archivos de un usuario
    List<FileEntity> findByUserId(UUID userId);

    // Buscar por tipo
    List<FileEntity> findByType(FileType type);

    // Buscar por usuario y tipo
    List<FileEntity> findByUserIdAndType(UUID userId, FileType type);

    // Buscar por extensión
    List<FileEntity> findByExtension(String extension);

    // Búsqueda por nombre parcial (LIKE)
    List<FileEntity> findByNameContainingIgnoreCase(String name);

    // Verificar si existe un archivo con ese nombre para un usuario
    boolean existsByNameAndUserId(String name, UUID userId);

    // Contar archivos por usuario
    long countByUserId(UUID userId);

    // Borrar todos los archivos de un usuario
    void deleteByUserIdAndName(UUID userId, String name);
 
}
