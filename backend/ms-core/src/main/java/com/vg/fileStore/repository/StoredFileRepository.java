package com.vg.fileStore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vg.fileStore.model.StoredFile;

import java.util.List;
import java.util.UUID;

public interface StoredFileRepository extends JpaRepository<StoredFile, UUID> {
        // Derivación: findBy + User_Id (el campo se llama "user", su id es "id")
    List<StoredFile> findByUserIdOrderByUploadedAtDesc(UUID userId);

    // O si prefieres explícito con @Query:
    @Query("SELECT f FROM StoredFile f WHERE f.user.id = :userId ORDER BY f.uploadedAt DESC")
    List<StoredFile> findByUser(@Param("userId") UUID userId);

    // Contar archivos por usuario
    long countByUserId(UUID userId);

    // Traer archivos con el user ya cargado (evita LazyInitializationException)
    @Query("SELECT f FROM StoredFile f JOIN FETCH f.user WHERE f.user.id = :userId")
    List<StoredFile> findByUserIdWithUser(@Param("userId") UUID userId);
}