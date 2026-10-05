package com.vg.fileStore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vg.fileStore.model.StoredFile;

import java.util.List;
import java.util.UUID;

/**
 * Repositorio JPA para la entidad StoredFile.
 * Extiende JpaRepository para heredar las operaciones CRUD estándar
 * y los métodos de consulta derivados por nombre de método.
 */
public interface StoredFileRepository extends JpaRepository<StoredFile, Long> {

    /**
     * Busca todos los archivos de un usuario ordenados por fecha de subida descendente.
     * Derivación: findBy + User_Id (el campo se llama "user", su id es "id").
     *
     * @param userId id del usuario propietario
     * @return lista de archivos del usuario, del más reciente al más antiguo
     */
    // Derivación: findBy + User_Id (el campo se llama "user", su id es "id")
    List<StoredFile> findByUserIdOrderByUploadedAtDesc(UUID userId);

    /**
     * Alternativa explícita con @Query para buscar por usuario ordenado por fecha desc.
     *
     * @param userId id del usuario propietario
     * @return lista de archivos del usuario, del más reciente al más antiguo
     */
    // O si prefieres explícito con @Query:
    @Query("SELECT f FROM StoredFile f WHERE f.user.id = :userId ORDER BY f.uploadedAt DESC")
    List<StoredFile> findByUser(@Param("userId") UUID userId);

    /**
     * Cuenta cuántos archivos tiene un usuario.
     *
     * @param userId id del usuario propietario
     * @return número total de archivos del usuario
     */
    // Contar archivos por usuario
    long countByUserId(UUID userId);

    /**
     * Trae los archivos de un usuario con la relación "user" ya cargada (JOIN FETCH),
     * evitando así LazyInitializationException al acceder fuera de la sesión.
     *
     * @param userId id del usuario propietario
     * @return lista de archivos con el usuario ya inicializado
     */
    // Traer archivos con el user ya cargado (evita LazyInitializationException)
    @Query("SELECT f FROM StoredFile f JOIN FETCH f.user WHERE f.user.id = :userId")
    List<StoredFile> findByUserIdWithUser(@Param("userId") UUID userId);
}