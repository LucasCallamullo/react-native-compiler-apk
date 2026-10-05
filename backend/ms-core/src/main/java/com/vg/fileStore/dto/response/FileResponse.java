package com.vg.fileStore.dto.response;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO de salida para archivos.
 * Expone solo lo que el cliente necesita ver.
 * NO incluye storedName ni relativePath (son internos del disco).
 * userId va plano (UUID) para no disparar el lazy load de User.
 */
public record FileResponse(

        /**
         * id del archivo almacenado.
         */
        Long id,

        /**
         * nombre original del archivo tal como lo subió el usuario.
         */
        String originalName,

        /**
         * tipo MIME del archivo (ej "image/png", "application/pdf").
         */
        String contentType,

        /**
         * tamaño del archivo en bytes.
         */
        long size,

        /**
         * fecha y hora en que el archivo fue subido.
         */
        Instant uploadedAt,

        /**
         * id del usuario propietario del archivo (UUID plano).
         */
        UUID userId,

        /**
         * URL desde la cual el cliente puede descargar el archivo.
         */
        String downloadUrl
) {}