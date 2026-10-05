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
        Long id,
        String originalName,
        String contentType,
        long size,
        Instant uploadedAt,
        UUID userId,
        String downloadUrl
) {}