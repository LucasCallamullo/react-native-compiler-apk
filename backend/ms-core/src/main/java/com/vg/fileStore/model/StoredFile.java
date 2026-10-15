package com.vg.fileStore.model;

import java.time.Instant;

import com.vg.auth.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad JPA que representa un archivo almacenado en disco.
 * Tabla: stored_files
 * Lombok genera getters, setters, constructor vacío, constructor completo y builder.
 */
@Entity
@Table(name = "stored_files")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StoredFile {

    /**
     * id autogenerado por la base de datos (estrategia IDENTITY).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * nombre original del archivo tal como lo subió el usuario.
     * Obligatorio, no puede ser nulo.
     */
    @Column(nullable = false)
    private String originalName;

    /**
     * nombre físico del archivo en disco.
     * Obligatorio y único.
     */
    @Column(nullable = false, unique = true)
    private String storedNameSimple;


    /**
     * extenson del archivo en disco.
     */
    @Column
    private String extension;

    /**
     * tipo MIME del archivo (ej "image/png", "application/pdf").
     * Obligatorio, no puede ser nulo.
     */
    @Column(nullable = false)
    private String contentType;

    /**
     * tamaño del archivo en bytes.
     * Obligatorio, no puede ser nulo.
     */
    @Column(nullable = false)
    private long size;

    /**
     * ruta relativa del archivo dentro del directorio de almacenamiento.
     * Obligatorio, no puede ser nulo.
     */
    @Column(nullable = false)
    private String relativePath;    // subcarpeta/archivo

    /**
     * fecha y hora en que el archivo fue subido.
     * Obligatorio, no puede ser nulo.
     */
    @Column(nullable = false)
    private Instant uploadedAt;

    /**
     * usuario propietario del archivo.
     * Relación ManyToOne con carga perezosa (LAZY). Obligatorio.
     * Columna de unión: user_id (no nula).
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}